import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertContactMessageSchema, insertContentSchema, insertCourseSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";
import nodemailer from "nodemailer";

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = uploadsDir;
    
    if (file.fieldname === 'id_document') {
      uploadPath = path.join(uploadsDir, 'ids');
    } else if (file.fieldname === 'transfer_letter') {
      uploadPath = path.join(uploadsDir, 'transfers');
    } else if (file.fieldname === 'resume') {
      uploadPath = path.join(uploadsDir, 'resumes');
    }
    
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: multerStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'id_document') {
      if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new Error('ID document must be an image or PDF'));
      }
    } else if (file.fieldname === 'transfer_letter' || file.fieldname === 'resume') {
      if (file.mimetype === 'application/pdf' || 
          file.mimetype === 'application/msword' || 
          file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        cb(null, true);
      } else {
        cb(new Error('Document must be PDF, DOC, or DOCX'));
      }
    } else {
      cb(null, true);
    }
  }
});

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'admin@example.com',
    pass: process.env.EMAIL_PASS || 'password'
  }
});

// Generate student ID
function generateStudentId(): string {
  return `STU${Date.now().toString().slice(-6)}`;
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Student registration
  app.post('/api/register/student', upload.fields([
    { name: 'id_document', maxCount: 1 },
    { name: 'transfer_letter', maxCount: 1 }
  ]), async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse({
        ...req.body,
        role: 'student',
        studentId: req.body.studentId || generateStudentId(),
        isTransferStudent: req.body.is_transfer === 'yes'
      });

      // Handle file uploads
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files.id_document) {
        validatedData.idDocumentPath = files.id_document[0].path;
      }
      if (files.transfer_letter && validatedData.isTransferStudent) {
        validatedData.transferLetterPath = files.transfer_letter[0].path;
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      const user = await storage.createUser(validatedData);

      // Send notification email
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER || 'admin@example.com',
          to: 'admin@edusphere.com',
          subject: 'New Student Registration - EduSphere',
          html: `
            <h1>New Student Registration</h1>
            <p>A new student has registered on EduSphere.</p>
            <h2>Student Details:</h2>
            <ul>
              <li><strong>Name:</strong> ${user.fullName}</li>
              <li><strong>Email:</strong> ${user.email}</li>
              <li><strong>Student ID:</strong> ${user.studentId}</li>
              <li><strong>Transfer Student:</strong> ${user.isTransferStudent ? 'Yes' : 'No'}</li>
              ${user.previousInstitution ? `<li><strong>Previous Institution:</strong> ${user.previousInstitution}</li>` : ''}
            </ul>
          `
        });
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
      }

      res.status(201).json({ 
        message: 'Student registration successful',
        user: { 
          id: user.id, 
          fullName: user.fullName, 
          email: user.email, 
          studentId: user.studentId 
        }
      });
    } catch (error) {
      console.error('Student registration error:', error);
      res.status(400).json({ message: error instanceof Error ? error.message : 'Registration failed' });
    }
  });

  // Teacher registration
  app.post('/api/register/teacher', upload.single('resume'), async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse({
        ...req.body,
        role: 'teacher'
      });

      if (req.file) {
        validatedData.resumePath = req.file.path;
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      const user = await storage.createUser(validatedData);

      // Send notification email
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER || 'admin@example.com',
          to: 'admin@edusphere.com',
          subject: 'New Teacher Application - EduSphere',
          html: `
            <h1>New Teacher Application</h1>
            <p>A new teacher has applied to join EduSphere.</p>
            <h2>Teacher Details:</h2>
            <ul>
              <li><strong>Name:</strong> ${user.fullName}</li>
              <li><strong>Email:</strong> ${user.email}</li>
              <li><strong>Specialization:</strong> ${user.specialization}</li>
              <li><strong>Experience:</strong> ${user.experience}</li>
              <li><strong>Qualifications:</strong> ${user.qualifications}</li>
            </ul>
          `
        });
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
      }

      res.status(201).json({ 
        message: 'Teacher application submitted successfully',
        user: { 
          id: user.id, 
          fullName: user.fullName, 
          email: user.email 
        }
      });
    } catch (error) {
      console.error('Teacher registration error:', error);
      res.status(400).json({ message: error instanceof Error ? error.message : 'Registration failed' });
    }
  });

  // User login (mock authentication)
  app.post('/api/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          studentId: user.studentId
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Login failed' });
    }
  });

  // Admin authentication
  app.post('/api/admin/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Support both admin accounts
      if ((email === 'admin@gmail.com' && password === 'adminpass123') ||
          (email === 'munir@gmail.com' && password === '12341234')) {
        res.json({ message: 'Admin authentication successful', admin: true });
      } else {
        res.status(401).json({ message: 'Invalid admin credentials' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Authentication failed' });
    }
  });

  // Get all content
  app.get('/api/content', async (req, res) => {
    try {
      const content = await storage.getAllContent();
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch content' });
    }
  });

  // Update content
  app.put('/api/content/:section', async (req, res) => {
    try {
      const { section } = req.params;
      const validatedData = insertContentSchema.parse(req.body);
      
      const content = await storage.updateContent(section, validatedData);
      res.json(content);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to update content' });
    }
  });

  // Get all courses
  app.get('/api/courses', async (req, res) => {
    try {
      const courses = await storage.getAllCourses();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch courses' });
    }
  });

  // Create course
  app.post('/api/courses', async (req, res) => {
    try {
      const validatedData = insertCourseSchema.parse(req.body);
      const course = await storage.createCourse(validatedData);
      res.status(201).json(course);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to create course' });
    }
  });

  // Update course
  app.put('/api/courses/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertCourseSchema.partial().parse(req.body);
      
      const course = await storage.updateCourse(id, validatedData);
      res.json(course);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to update course' });
    }
  });

  // Delete course
  app.delete('/api/courses/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteCourse(id);
      
      if (success) {
        res.json({ message: 'Course deleted successfully' });
      } else {
        res.status(404).json({ message: 'Course not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete course' });
    }
  });

  // Contact form submission
  app.post('/api/contact', async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);

      // Send notification email
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER || 'admin@example.com',
          to: 'admin@edusphere.com',
          subject: `New Contact Message: ${validatedData.subject}`,
          html: `
            <h1>New Contact Message</h1>
            <p><strong>From:</strong> ${validatedData.firstName} ${validatedData.lastName}</p>
            <p><strong>Email:</strong> ${validatedData.email}</p>
            <p><strong>Subject:</strong> ${validatedData.subject}</p>
            <p><strong>Message:</strong></p>
            <p>${validatedData.message}</p>
          `
        });
      } catch (emailError) {
        console.error('Contact email notification failed:', emailError);
      }

      res.status(201).json({ message: 'Contact message sent successfully' });
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Failed to send message' });
    }
  });

  // Get all users (admin only)
  app.get('/api/admin/users', async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users.map(user => ({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        createdAt: user.createdAt
      })));
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch users' });
    }
  });

  // Get statistics (admin only)
  app.get('/api/admin/stats', async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const courses = await storage.getAllCourses();
      const messages = await storage.getAllContactMessages();

      const stats = {
        totalStudents: users.filter(user => user.role === 'student').length,
        totalTeachers: users.filter(user => user.role === 'teacher').length,
        activeCourses: courses.length,
        totalMessages: messages.length,
        recentRegistrations: users
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5)
          .map(user => ({
            id: user.id,
            name: user.fullName,
            email: user.email,
            role: user.role,
            date: user.createdAt
          }))
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch statistics' });
    }
  });

  // Image upload for content management
  const contentUpload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        const contentUploadsDir = path.join(uploadsDir, 'content');
        if (!fs.existsSync(contentUploadsDir)) {
          fs.mkdirSync(contentUploadsDir, { recursive: true });
        }
        cb(null, contentUploadsDir);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
      }
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'));
      }
    }
  });

  // Upload content image
  app.post('/api/admin/upload-image', contentUpload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No image file provided' });
      }
      
      const imageUrl = `/uploads/content/${req.file.filename}`;
      res.json({ imageUrl });
    } catch (error) {
      res.status(500).json({ message: 'Failed to upload image' });
    }
  });

  // Content.json management
  const contentJsonPath = path.join(process.cwd(), 'content.json');
  
  // Initialize content.json if it doesn't exist
  if (!fs.existsSync(contentJsonPath)) {
    const defaultContent = {
      home: {
        title: "Transform Your Learning Journey",
        description: "Join thousands of students and educators in our modern learning platform. Access quality education, connect with expert instructors, and unlock your potential.",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
      },
      about: {
        title: "About EduSphere",
        description: "Founded in 2020, EduSphere has been at the forefront of digital education, empowering learners worldwide with innovative online courses and cutting-edge learning technologies.",
        image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
      },
      contact: {
        title: "Get In Touch",
        description: "Have questions about our courses or need assistance? We're here to help you on your learning journey.",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
      }
    };
    fs.writeFileSync(contentJsonPath, JSON.stringify(defaultContent, null, 2));
  }

  // Get content.json data
  app.get('/api/admin/page-content', async (req, res) => {
    try {
      const contentData = JSON.parse(fs.readFileSync(contentJsonPath, 'utf-8'));
      res.json(contentData);
    } catch (error) {
      res.status(500).json({ message: 'Failed to load page content' });
    }
  });

  // Update content.json data
  app.put('/api/admin/page-content', async (req, res) => {
    try {
      const { page, title, description, image } = req.body;
      
      if (!page || !['home', 'about', 'contact'].includes(page)) {
        return res.status(400).json({ message: 'Invalid page specified' });
      }

      const contentData = JSON.parse(fs.readFileSync(contentJsonPath, 'utf-8'));
      
      if (title !== undefined) contentData[page].title = title;
      if (description !== undefined) contentData[page].description = description;
      if (image !== undefined) contentData[page].image = image;

      fs.writeFileSync(contentJsonPath, JSON.stringify(contentData, null, 2));
      
      res.json({ message: 'Content updated successfully', content: contentData[page] });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update content' });
    }
  });

  // Serve uploaded files
  app.use('/uploads', (req, res, next) => {
    const filePath = path.join(uploadsDir, req.path);
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ message: 'File not found' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
