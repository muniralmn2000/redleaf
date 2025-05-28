import { users, content, courses, contactMessages, type User, type InsertUser, type Content, type InsertContent, type Course, type InsertCourse, type ContactMessage, type InsertContactMessage } from "@shared/schema";

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  // Content management
  getContent(section: string): Promise<Content | undefined>;
  getAllContent(): Promise<Content[]>;
  updateContent(section: string, content: Partial<InsertContent>): Promise<Content>;
  
  // Course management
  getAllCourses(): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: number, course: Partial<InsertCourse>): Promise<Course>;
  deleteCourse(id: number): Promise<boolean>;
  
  // Contact messages
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getAllContactMessages(): Promise<ContactMessage[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private content: Map<string, Content>;
  private courses: Map<number, Course>;
  private contactMessages: Map<number, ContactMessage>;
  private currentUserId: number;
  private currentContentId: number;
  private currentCourseId: number;
  private currentMessageId: number;

  constructor() {
    this.users = new Map();
    this.content = new Map();
    this.courses = new Map();
    this.contactMessages = new Map();
    this.currentUserId = 1;
    this.currentContentId = 1;
    this.currentCourseId = 1;
    this.currentMessageId = 1;
    
    // Initialize with default content
    this.initializeDefaultContent();
    this.initializeDefaultCourses();
  }

  private initializeDefaultContent() {
    const defaultContents = [
      {
        section: 'hero',
        title: 'Transform Your Learning Journey',
        subtitle: 'Join thousands of students and educators in our modern learning platform. Access quality education, connect with expert instructors, and unlock your potential.',
        description: '',
        imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600'
      },
      {
        section: 'about',
        title: 'About EduSphere',
        subtitle: 'Founded in 2020, EduSphere has been at the forefront of digital education, empowering learners worldwide with innovative online courses and cutting-edge learning technologies.',
        description: 'Our mission is to democratize education by making high-quality learning accessible to everyone, regardless of location or background. We believe that education is the key to unlocking human potential and creating a better future for all.',
        imageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600'
      }
    ];

    defaultContents.forEach(content => {
      const id = this.currentContentId++;
      this.content.set(content.section, {
        id,
        ...content,
        updatedAt: new Date()
      });
    });
  }

  private initializeDefaultCourses() {
    const defaultCourses = [
      {
        title: 'Full Stack Web Development',
        description: 'Master modern web technologies including React, Node.js, and MongoDB to build complete web applications.',
        category: 'Technology',
        price: 199,
        duration: '12 weeks',
        studentCount: 2456,
        rating: '4.9',
        imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=250',
        isActive: true
      },
      {
        title: 'Data Science & Analytics',
        description: 'Learn Python, machine learning, and statistical analysis to extract insights from complex datasets.',
        category: 'Science',
        price: 249,
        duration: '16 weeks',
        studentCount: 1892,
        rating: '4.8',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=250',
        isActive: true
      },
      {
        title: 'Digital Marketing Mastery',
        description: 'Master SEO, social media marketing, content strategy, and analytics to grow your digital presence.',
        category: 'Business',
        price: 149,
        duration: '10 weeks',
        studentCount: 3241,
        rating: '4.7',
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=250',
        isActive: true
      }
    ];

    defaultCourses.forEach(course => {
      const id = this.currentCourseId++;
      this.courses.set(id, {
        id,
        ...course,
        createdAt: new Date()
      });
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getContent(section: string): Promise<Content | undefined> {
    return this.content.get(section);
  }

  async getAllContent(): Promise<Content[]> {
    return Array.from(this.content.values());
  }

  async updateContent(section: string, updateData: Partial<InsertContent>): Promise<Content> {
    const existing = this.content.get(section);
    const id = existing?.id || this.currentContentId++;
    
    const updatedContent: Content = {
      id,
      section,
      title: updateData.title || existing?.title || '',
      subtitle: updateData.subtitle || existing?.subtitle || '',
      description: updateData.description || existing?.description || '',
      imageUrl: updateData.imageUrl || existing?.imageUrl || '',
      updatedAt: new Date()
    };
    
    this.content.set(section, updatedContent);
    return updatedContent;
  }

  async getAllCourses(): Promise<Course[]> {
    return Array.from(this.courses.values()).filter(course => course.isActive);
  }

  async getCourse(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const id = this.currentCourseId++;
    const course: Course = {
      ...insertCourse,
      id,
      createdAt: new Date()
    };
    this.courses.set(id, course);
    return course;
  }

  async updateCourse(id: number, updateData: Partial<InsertCourse>): Promise<Course> {
    const existing = this.courses.get(id);
    if (!existing) {
      throw new Error('Course not found');
    }
    
    const updatedCourse: Course = {
      ...existing,
      ...updateData,
      id
    };
    
    this.courses.set(id, updatedCourse);
    return updatedCourse;
  }

  async deleteCourse(id: number): Promise<boolean> {
    const existing = this.courses.get(id);
    if (!existing) {
      return false;
    }
    
    // Soft delete by setting isActive to false
    const updatedCourse: Course = {
      ...existing,
      isActive: false
    };
    
    this.courses.set(id, updatedCourse);
    return true;
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = this.currentMessageId++;
    const message: ContactMessage = {
      ...insertMessage,
      id,
      createdAt: new Date()
    };
    this.contactMessages.set(id, message);
    return message;
  }

  async getAllContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values());
  }
}

export const storage = new MemStorage();
