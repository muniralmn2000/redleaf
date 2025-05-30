import { users, content, courses, contactMessages, type User, type InsertUser, type Content, type InsertContent, type Course, type InsertCourse, type ContactMessage, type InsertContactMessage } from "../shared/schema";
import prisma from './prismaClient';
import type { User as PrismaUser, Course as PrismaCourse, Content as PrismaContent, ContactMessage as PrismaContactMessage } from '../generated/prisma';

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  createUser(user: any): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUserStatus(id: number, status: "pending" | "active" | "rejected"): Promise<User>;
  
  // Content management
  getContent(section: string): Promise<Content | null>;
  getAllContent(): Promise<Content[]>;
  updateContent(section: string, content: any): Promise<Content>;
  
  // Course management
  getAllCourses(): Promise<Course[]>;
  getCourse(id: number): Promise<Course | null>;
  createCourse(course: any): Promise<Course>;
  updateCourse(id: number, course: any): Promise<Course>;
  deleteCourse(id: number): Promise<boolean>;
  
  // Contact messages
  createContactMessage(message: any): Promise<ContactMessage>;
  getAllContactMessages(): Promise<ContactMessage[]>;
  replyToContactMessage(id: number, reply: string): Promise<ContactMessage>;
}

export class PrismaStorage implements IStorage {
  // User management
  async getUser(id: number) {
    return prisma.user.findUnique({ where: { id } });
  }
  async getUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }
  async createUser(user: InsertUser) {
    return prisma.user.create({ data: { ...user, status: 'pending' } });
  }
  async getAllUsers() {
    return prisma.user.findMany();
  }
  async updateUserStatus(id: number, status: "pending" | "active" | "rejected") {
    return prisma.user.update({ where: { id }, data: { status } });
  }

  // Content management
  async getContent(section: string) {
    return prisma.content.findUnique({ where: { section } });
  }
  async getAllContent() {
    return prisma.content.findMany();
  }
  async updateContent(section: string, content: any) {
    return prisma.content.upsert({
      where: { section },
      update: {
        title: content.title ?? null,
        subtitle: content.subtitle ?? null,
        description: content.description ?? null,
        imageUrl: content.imageUrl ?? null,
      },
      create: {
        section,
        title: content.title ?? null,
        subtitle: content.subtitle ?? null,
        description: content.description ?? null,
        imageUrl: content.imageUrl ?? null,
      },
    });
  }

  // Course management
  async getAllCourses() {
    return prisma.course.findMany({ where: { isActive: true } });
  }
  async getCourse(id: number) {
    return prisma.course.findUnique({ where: { id } });
  }
  async createCourse(course: any) {
    return prisma.course.create({ data: {
      ...course,
      studentCount: typeof course.studentCount === 'number' ? course.studentCount : 0,
      rating: course.rating ?? '4.8',
      isActive: course.isActive ?? true,
    }});
  }
  async updateCourse(id: number, course: any) {
    return prisma.course.update({ where: { id }, data: {
      ...course,
      studentCount: typeof course.studentCount === 'number' ? course.studentCount : 0,
    }});
  }
  async deleteCourse(id: number) {
    await prisma.course.update({ where: { id }, data: { isActive: false } });
    return true;
  }

  // Contact messages
  async createContactMessage(message: InsertContactMessage) {
    return prisma.contactMessage.create({ data: message });
  }
  async getAllContactMessages() {
    return prisma.contactMessage.findMany();
  }
  async replyToContactMessage(id: number, reply: string) {
    return prisma.contactMessage.update({ where: { id }, data: { reply } });
  }
}

const storage = new PrismaStorage();
export default storage;
