import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  company: text("company"),
  role: text("role").notNull().default("client"), // client, admin
  avatarUrl: text("avatar_url"),
  firebaseUid: text("firebase_uid").unique(), // Voor sociale login
  verified: boolean("verified").notNull().default(false),
  verificationToken: text("verification_token"),
  verificationExpires: timestamp("verification_expires"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  lastLogin: timestamp("last_login"),
  preferences: jsonb("preferences").default({}),
});

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company").notNull(),
  service: text("service").notNull(),
  message: text("message").notNull(),
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
  read: boolean("read").notNull().default(false),
});

// Chat conversations and messages for the AI chatbot
export const chatSessions = pgTable("chat_sessions", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  email: text("email"),
  name: text("name"),
  company: text("company"),
  preferences: jsonb("preferences").default({}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  lastActivity: timestamp("last_activity").notNull().defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().references(() => chatSessions.sessionId, { onDelete: 'cascade' }),
  content: text("content").notNull(),
  role: text("role").notNull(), // 'user' or 'assistant'
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

// Projects for clients
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("pending"), // pending, approved, in-progress, review, completed, rejected
  type: text("type").notNull(), // website, application, dashboard, etc.
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  budget: text("budget"),
  thumbnailUrl: text("thumbnail_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  metaData: jsonb("meta_data").default({}),
});

// Project milestones
export const milestones = pgTable("milestones", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  dueDate: timestamp("due_date"),
  completedDate: timestamp("completed_date"),
  status: text("status").notNull().default("pending"), // pending, in-progress, completed
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Project files for file sharing
export const projectFiles = pgTable("project_files", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projects.id, { onDelete: 'cascade' }),
  name: text("name").notNull(),
  fileUrl: text("file_url").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: integer("file_size").notNull(),
  uploadedBy: integer("uploaded_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  description: text("description"),
});

// Client-specific notifications
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull().default("info"), // info, warning, success, error
  read: boolean("read").notNull().default(false),
  link: text("link"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  name: true,
  company: true,
  role: true,
  avatarUrl: true,
  firebaseUid: true,
  preferences: true,
  verified: true,
});

export const insertContactSchema = createInsertSchema(contacts).pick({
  name: true,
  email: true,
  company: true,
  service: true,
  message: true,
});

export const insertChatSessionSchema = createInsertSchema(chatSessions).pick({
  sessionId: true,
  email: true,
  name: true,
  company: true,
  preferences: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).pick({
  sessionId: true,
  content: true,
  role: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;

export type InsertChatSession = z.infer<typeof insertChatSessionSchema>;
export type ChatSession = typeof chatSessions.$inferSelect;

export const insertProjectSchema = createInsertSchema(projects)
  .pick({
    userId: true,
    name: true,
    description: true,
    status: true,
    type: true,
    startDate: true,
    endDate: true,
    budget: true,
    thumbnailUrl: true,
    metaData: true,
  })
  .transform((data) => {
    console.log("Schema transforming project data:", data);
    
    // Als metaData een string is, parse het als JSON
    if (typeof data.metaData === 'string') {
      try {
        data.metaData = JSON.parse(data.metaData);
        console.log("Parsed metaData from string:", data.metaData);
      } catch (e) {
        console.error("Failed to parse metaData JSON string:", e);
      }
    }
    
    // Als userId een string is, convert naar number
    if (typeof data.userId === 'string') {
      data.userId = parseInt(data.userId, 10);
      console.log("Converted userId from string to number:", data.userId);
    }
    
    return data;
  });

export const insertMilestoneSchema = createInsertSchema(milestones).pick({
  projectId: true,
  title: true,
  description: true,
  dueDate: true,
  completedDate: true,
  status: true,
  order: true,
});

export const insertProjectFileSchema = createInsertSchema(projectFiles).pick({
  projectId: true,
  name: true,
  fileUrl: true,
  fileType: true,
  fileSize: true,
  uploadedBy: true,
  description: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).pick({
  userId: true,
  title: true,
  message: true,
  type: true,
  link: true,
});

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export type InsertMilestone = z.infer<typeof insertMilestoneSchema>;
export type Milestone = typeof milestones.$inferSelect;

export type InsertProjectFile = z.infer<typeof insertProjectFileSchema>;
export type ProjectFile = typeof projectFiles.$inferSelect;

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;
