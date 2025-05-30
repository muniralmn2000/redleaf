import type { Express } from "express";
import { createServer, type Server } from "http";
import storage from "./storage";
import {
  insertUserSchema,
  insertContactMessageSchema,
  insertContentSchema,
  insertCourseSchema,
} from "@shared/schema";
import multer, { StorageEngine } from "multer";
import path from "path";
import fs from "fs";
import type { Request } from "express";
import nodemailer from "nodemailer";

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = uploadsDir;
    
    if (file.fieldname === "id_document") {
      uploadPath = path.join(uploadsDir, "ids");
    } else if (file.fieldname === "transfer_letter") {
      uploadPath = path.join(uploadsDir, "transfers");
    } else if (file.fieldname === "resume") {
      uploadPath = path.join(uploadsDir, "resumes");
    }
    
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

const upload = multer({
  storage: multerStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "id_document") {
      if (
        file.mimetype.startsWith("image/") ||
        file.mimetype === "application/pdf"
      ) {
        cb(null as any, true);
      } else {
        cb(null as any, false);
      }
    } else if (
      file.fieldname === "transfer_letter" ||
      file.fieldname === "resume"
    ) {
      if (
        file.mimetype === "application/pdf" ||
        file.mimetype === "application/msword" ||
        file.mimetype ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        cb(null as any, true);
      } else {
        cb(null as any, false);
      }
    } else {
      cb(null as any, true);
    }
  },
});

// Generate student ID
function generateStudentId(): string {
  return `STU${Date.now().toString().slice(-6)}`;
}

// Add multer for course image uploads
const courseUpload = multer({
  storage: multer.diskStorage({
    destination: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, destination: string) => void,
    ) => {
      const courseUploadsDir = path.join(uploadsDir, "courses");
      if (!fs.existsSync(courseUploadsDir)) {
        fs.mkdirSync(courseUploadsDir, { recursive: true });
      }
      cb(null, courseUploadsDir);
    },
    filename: (
      req: Request,
      file: Express.Multer.File,
      cb: (error: Error | null, filename: string) => void,
    ) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(
        null,
        file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
      );
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null as any, true);
    } else {
      cb(null as any, false);
    }
  },
});

// Setup nodemailer transporter (dummy SMTP for now)
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: process.env.ETHEREAL_USER || "test@ethereal.email",
    pass: process.env.ETHEREAL_PASS || "testpass"
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Student registration
  app.post(
    "/api/register/student",
    upload.fields([
      { name: "id_document", maxCount: 1 },
      { name: "transfer_letter", maxCount: 1 },
    ]),
    async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse({
        ...req.body,
          role: "student",
        studentId: req.body.studentId || generateStudentId(),
          isTransferStudent: req.body.is_transfer === "yes",
      });

      // Handle file uploads
        const files = req.files as {
          [fieldname: string]: Express.Multer.File[];
        };
      if (files.id_document) {
        validatedData.idDocumentPath = files.id_document[0].path;
      }
      if (files.transfer_letter && validatedData.isTransferStudent) {
        validatedData.transferLetterPath = files.transfer_letter[0].path;
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
          return res
            .status(400)
            .json({ message: "User already exists with this email" });
      }

      const user = await storage.createUser(validatedData);

      res.status(201).json({ 
          message: "Student registration successful",
        user: { 
          id: user.id, 
          fullName: user.fullName, 
          email: user.email, 
            studentId: user.studentId,
          },
      });
    } catch (error) {
        console.error("Student registration error:", error);
        res
          .status(400)
          .json({
            message:
              error instanceof Error ? error.message : "Registration failed",
          });
    }
    },
  );

  // Teacher registration
  app.post(
    "/api/register/teacher",
    upload.single("resume"),
    async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse({
        ...req.body,
          role: "teacher",
      });

      if (req.file) {
        validatedData.resumePath = req.file.path;
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
          return res
            .status(400)
            .json({ message: "User already exists with this email" });
      }

      const user = await storage.createUser(validatedData);

      res.status(201).json({ 
          message: "Teacher application submitted successfully",
        user: { 
          id: user.id, 
          fullName: user.fullName, 
            email: user.email,
          },
      });
    } catch (error) {
        console.error("Teacher registration error:", error);
        res
          .status(400)
          .json({
            message:
              error instanceof Error ? error.message : "Registration failed",
          });
    }
    },
  );

  // User login (mock authentication)
  app.post("/api/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user || !user.password || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      if (user.status !== "active") {
        if (user.status === "pending") {
          return res.status(403).json({ message: "Your registration is pending approval." });
        } else if (user.status === "rejected") {
          return res.status(403).json({ message: "Your registration was not accepted." });
        } else {
          return res.status(403).json({ message: "Your account is not active." });
        }
      }

      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          studentId: user.studentId,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Admin authentication
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Support both admin accounts
      if (
        (email === "admin@gmail.com" && password === "adminpass123") ||
        (email === "munir@gmail.com" && password === "12341234")
      ) {
        res.json({ message: "Admin authentication successful", admin: true });
      } else {
        res.status(401).json({ message: "Invalid admin credentials" });
      }
    } catch (error) {
      res.status(500).json({ message: "Authentication failed" });
    }
  });

  // Get all content
  app.get("/api/content", async (req, res) => {
    try {
      const content = await storage.getAllContent();
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });

  // Update content
  app.put("/api/content/:section", async (req, res) => {
    try {
      const { section } = req.params;
      const validatedData = insertContentSchema.parse(req.body);
      
      const content = await storage.updateContent(section, validatedData);
      res.json(content);
    } catch (error) {
      res
        .status(400)
        .json({
          message:
            error instanceof Error ? error.message : "Failed to update content",
        });
    }
  });

  // Get all courses
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await storage.getAllCourses();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  // Create course
  app.post("/api/courses", async (req, res) => {
    try {
      const validatedData = insertCourseSchema.parse(req.body);
      const course = await storage.createCourse(validatedData);
      res.status(201).json(course);
    } catch (error) {
      res
        .status(400)
        .json({
          message:
            error instanceof Error ? error.message : "Failed to create course",
        });
    }
  });

  // Update course (with image upload support)
  app.put(
    "/api/courses/:id",
    courseUpload.single("image"),
    async (req, res) => {
    try {
      const id = parseInt(req.params.id);
        // If multipart/form-data, req.body fields may be strings; parse numbers as needed
        const body = { ...req.body };
        if (body.price) body.price = parseInt(body.price);
        if (body.studentCount) body.studentCount = parseInt(body.studentCount);
        // Use zod schema for validation
        const validatedData = insertCourseSchema.partial().parse(body);
        if (req.file) {
          validatedData.imageUrl = `/uploads/courses/${req.file.filename}`;
        }
      const course = await storage.updateCourse(id, validatedData);
      res.json(course);
    } catch (error) {
        res
          .status(400)
          .json({
            message:
              error instanceof Error
                ? error.message
                : "Failed to update course",
          });
    }
    },
  );

  // Delete course
  app.delete("/api/courses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteCourse(id);
      
      if (success) {
        res.json({ message: "Course deleted successfully" });
      } else {
        res.status(404).json({ message: "Course not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete course" });
    }
  });

  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);

      res.status(201).json({ message: "Contact message sent successfully" });
    } catch (error) {
      res
        .status(400)
        .json({
          message:
            error instanceof Error ? error.message : "Failed to send message",
        });
    }
  });

  // Get all users (admin only)
  app.get("/api/admin/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(
        users.map((user) => ({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
          createdAt: user.createdAt ?? Date.now(),
          status: user.status,
          idDocumentPath: user.idDocumentPath,
          transferLetterPath: user.transferLetterPath,
          resumePath: user.resumePath,
          isTransferStudent: user.isTransferStudent,
          previousInstitution: user.previousInstitution,
          specialization: user.specialization,
          experience: user.experience,
          qualifications: user.qualifications,
        })),
      );
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Get statistics (admin only)
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const courses = await storage.getAllCourses();
      const messages = await storage.getAllContactMessages();

      const stats = {
        totalStudents: users.filter((user) => user.role === "student").length,
        totalTeachers: users.filter((user) => user.role === "teacher").length,
        activeCourses: courses.length,
        totalMessages: messages.length,
        recentRegistrations: users
          .sort(
            (a, b) =>
              new Date(b.createdAt ?? Date.now()).getTime() -
              new Date(a.createdAt ?? Date.now()).getTime(),
          )
          .slice(0, 5)
          .map((user) => ({
            id: user.id,
            name: user.fullName,
            email: user.email,
            role: user.role,
            date: user.createdAt ?? Date.now(),
          })),
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  // Image upload for content management
  const contentUpload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        const contentUploadsDir = path.join(uploadsDir, "content");
        if (!fs.existsSync(contentUploadsDir)) {
          fs.mkdirSync(contentUploadsDir, { recursive: true });
        }
        cb(null, contentUploadsDir);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(
          null,
          file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
        );
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith("image/")) {
        cb(null as any, true);
      } else {
        cb(null as any, false);
      }
    },
  });

  // Upload content image
  app.post(
    "/api/admin/upload-image",
    contentUpload.single("image"),
    async (req, res) => {
    try {
      if (!req.file) {
          return res.status(400).json({ message: "No image file provided" });
      }
      
      const imageUrl = `/uploads/content/${req.file.filename}`;
      res.json({ imageUrl });
    } catch (error) {
        res.status(500).json({ message: "Failed to upload image" });
    }
    },
  );

  // Content.json management
  const contentJsonPath = path.join(process.cwd(), "content.json");
  
  // Initialize content.json if it doesn't exist
  if (!fs.existsSync(contentJsonPath)) {
    const defaultContent = {
      home: {
        title: "Transform Your Learning Journey",
        description:
          "Join thousands of students and educators in our modern learning platform. Access quality education, connect with expert instructors, and unlock your potential.",
        image:
          "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
      },
      about: {
        title: "About EduSphere",
        description:
          "Founded in 2020, EduSphere has been at the forefront of digital education, empowering learners worldwide with innovative online courses and cutting-edge learning technologies.",
        image:
          "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
      },
      contact: {
        title: "Get In Touch",
        description:
          "Have questions about our courses or need assistance? We're here to help you on your learning journey.",
        image:
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
      },
      features: {
        title: "Why Choose EduSphere?",
        description:
          "Discover the features that make our platform the preferred choice for modern learners.",
        image:
          "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      },
      testimonials: {
        title: "What Our Students Say",
        description:
          "Hear from thousands of students who have transformed their careers through our platform.",
        image:
          "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      },
    };
    fs.writeFileSync(contentJsonPath, JSON.stringify(defaultContent, null, 2));
  }

  // Get content.json data
  app.get("/api/admin/page-content", async (req, res) => {
    try {
      const contentData = JSON.parse(fs.readFileSync(contentJsonPath, "utf-8"));
      res.json(contentData);
    } catch (error) {
      res.status(500).json({ message: "Failed to load page content" });
    }
  });

  // Update content.json data
  app.put("/api/admin/page-content", async (req, res) => {
    try {
      console.log("Received PUT /api/admin/page-content:", req.body);
      const { page, ...fields } = req.body;
      // Dynamically allow any page that exists in content.json
      const contentData = JSON.parse(fs.readFileSync(contentJsonPath, "utf-8"));
      if (!page || !contentData[page]) {
        return res.status(400).json({ message: "Invalid page specified" });
      }
      // Update any field sent in the request
      Object.keys(fields).forEach((key) => {
        contentData[page][key] = fields[key];
      });
      fs.writeFileSync(contentJsonPath, JSON.stringify(contentData, null, 2));
      res.json({
        message: "Content updated successfully",
        content: contentData[page],
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to update content" });
    }
  });

  // Get all contact messages (admin only)
  app.get("/api/admin/messages", async (req, res) => {
    try {
      const messages = await storage.getAllContactMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Admin replies to a contact message
  app.post("/api/admin/messages/:id/reply", async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { reply } = req.body;
      if (!reply) return res.status(400).json({ message: "Reply is required" });
      const updated = await storage.replyToContactMessage(id, reply);
      if (!updated) return res.status(404).json({ message: "Message not found" });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to reply to message" });
    }
  });

  // Serve uploaded files
  app.use("/uploads", (req, res, next) => {
    const filePath = path.join(uploadsDir, req.path);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ message: "File not found" });
    }
  });

  // Get all messages for a user (by email)
  app.get("/api/my-messages", async (req, res) => {
    try {
      const email = req.query.email as string;
      if (!email) return res.status(400).json({ message: "Email is required" });
      const messages = await storage.getAllContactMessages();
      const userMessages = messages.filter((msg) => msg.email === email);
      res.json(userMessages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Admin: Accept user
  app.post("/api/admin/users/:id/accept", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      console.log(`[ACCEPT] Attempting to accept user with id:`, id);
      const user = await storage.getUser(id);
      console.log(`[ACCEPT] User lookup result:`, user);
      if (!user) {
        console.error(`[ACCEPT] User not found for id:`, id);
        return res.status(404).json({ message: "User not found" });
      }
      await storage.updateUserStatus(id, "active");
      // Try to send acceptance email, but don't fail if it errors
      try {
        await transporter.sendMail({
          from: 'admin@edusphere.com',
          to: user.email,
          subject: "Registration Accepted",
          text: `Hello ${user.fullName},\n\nYour registration has been accepted! You can now log in.\n\n- EduSphere Team`,
        });
      } catch (emailError) {
        console.error("[ACCEPT] Failed to send acceptance email:", emailError);
      }
      res.json({ message: "User accepted and notified (email may have failed)" });
    } catch (error) {
      console.error(`[ACCEPT] Error accepting user:`, error);
      res.status(500).json({ message: "Failed to accept user" });
    }
  });

  // Admin: Reject user
  app.post("/api/admin/users/:id/reject", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      console.log(`[REJECT] Attempting to reject user with id:`, id);
      const user = await storage.getUser(id);
      console.log(`[REJECT] User lookup result:`, user);
      if (!user) {
        console.error(`[REJECT] User not found for id:`, id);
        return res.status(404).json({ message: "User not found" });
      }
      await storage.updateUserStatus(id, "rejected");
      // Try to send rejection email, but don't fail if it errors
      try {
        await transporter.sendMail({
          from: 'admin@edusphere.com',
          to: user.email,
          subject: "Registration Not Accepted",
          text: `Hello ${user.fullName},\n\nWe regret to inform you that your registration was not accepted.\n\n- EduSphere Team`,
        });
      } catch (emailError) {
        console.error("[REJECT] Failed to send rejection email:", emailError);
      }
      res.json({ message: "User rejected and notified (email may have failed)" });
    } catch (error) {
      console.error(`[REJECT] Error rejecting user:`, error);
      res.status(500).json({ message: "Failed to reject user" });
    }
  });

  // Get all students (admin only)
  app.get("/api/admin/students", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const students = users.filter((user) => user.role === "student");
      res.json(students);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch students" });
    }
  });

  // Get all teachers (admin only)
  app.get("/api/admin/teachers", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const teachers = users.filter((user) => user.role === "teacher");
      res.json(teachers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch teachers" });
    }
  });

  // Get all courses (admin only)
  app.get("/api/admin/all-courses", async (req, res) => {
    try {
      const courses = await storage.getAllCourses();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  // Get all messages (admin only)
  app.get("/api/admin/all-messages", async (req, res) => {
    try {
      const messages = await storage.getAllContactMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
