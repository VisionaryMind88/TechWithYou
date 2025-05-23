import { 
  users, type User, type InsertUser, 
  contacts, type Contact, type InsertContact,
  chatSessions, type ChatSession, type InsertChatSession,
  chatMessages, type ChatMessage, type InsertChatMessage,
  projects, type Project, type InsertProject,
  milestones, type Milestone, type InsertMilestone,
  projectFiles, type ProjectFile, type InsertProjectFile,
  notifications, type Notification, type InsertNotification
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined>;
  getUsersByRole(role: string): Promise<User[]>;
  getUserByVerificationToken(token: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, data: Partial<Omit<InsertUser, 'password'>>): Promise<User | undefined>;
  updateUserPassword(id: number, password: string): Promise<User | undefined>;
  verifyUser(id: number): Promise<User | undefined>;
  setVerificationToken(id: number, token: string, expires: Date): Promise<User | undefined>;
  
  // Contact form submissions
  createContact(contact: InsertContact): Promise<Contact>;
  getContacts(): Promise<Contact[]>;
  getContact(id: number): Promise<Contact | undefined>;
  markContactAsRead(id: number): Promise<Contact | undefined>;
  
  // Chat sessions and messages
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  getChatSession(sessionId: string): Promise<ChatSession | undefined>;
  updateChatSessionPreferences(sessionId: string, preferences: any): Promise<ChatSession | undefined>;
  updateChatSessionActivity(sessionId: string): Promise<ChatSession | undefined>;
  
  // Chat messages
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatMessages(sessionId: string, limit?: number): Promise<ChatMessage[]>;
  
  // Project methods
  createProject(project: InsertProject): Promise<Project>;
  getProject(id: number): Promise<Project | undefined>;
  getUserProjects(userId: number): Promise<Project[]>;
  getAllProjects(): Promise<Project[]>;
  updateProject(id: number, data: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
  
  // Milestone methods
  createMilestone(milestone: InsertMilestone): Promise<Milestone>;
  getMilestone(id: number): Promise<Milestone | undefined>;
  getProjectMilestones(projectId: number): Promise<Milestone[]>;
  updateMilestone(id: number, data: Partial<InsertMilestone>): Promise<Milestone | undefined>;
  deleteMilestone(id: number): Promise<boolean>;
  
  // Project file methods
  createProjectFile(file: InsertProjectFile): Promise<ProjectFile>;
  getProjectFile(id: number): Promise<ProjectFile | undefined>;
  getProjectFiles(projectId: number): Promise<ProjectFile[]>;
  deleteProjectFile(id: number): Promise<boolean>;
  
  // Notification methods
  createNotification(notification: InsertNotification): Promise<Notification>;
  getUserNotifications(userId: number): Promise<Notification[]>;
  getUnreadNotificationCount(userId: number): Promise<number>;
  markNotificationAsRead(id: number): Promise<Notification | undefined>;
  markAllNotificationsAsRead(userId: number): Promise<boolean>;
  deleteNotification(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      // Trim de gebruikersnaam om spaties te verwijderen
      const trimmedUsername = username.trim();
      console.log(`DatabaseStorage.getUserByUsername: zoeken naar gebruiker met username="${trimmedUsername}" (origineel: "${username}")`);
      
      // Gebruik de Drizzle ORM methode (veiliger en betrouwbaarder)
      console.log(`DatabaseStorage.getUserByUsername: gebruiken van Drizzle ORM`);
      const drizzleResult = await db.select().from(users).where(eq(users.username, trimmedUsername));
      
      const resultLength = drizzleResult?.length || 0;
      console.log(`DatabaseStorage.getUserByUsername: Drizzle resultaat: ${resultLength} gebruikers gevonden`);
      
      if (resultLength > 0 && drizzleResult[0]) {
        console.log(`DatabaseStorage.getUserByUsername: gebruiker gevonden met ID ${drizzleResult[0].id}`);
      } else {
        console.log(`DatabaseStorage.getUserByUsername: geen gebruiker gevonden met username=${trimmedUsername}`);
      }
      
      const [user] = drizzleResult;
      return user || undefined;
    } catch (error) {
      console.error(`DatabaseStorage.getUserByUsername: Fout bij ophalen gebruiker:`, error);
      throw error;
    }
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      // Trim de email om spaties te verwijderen
      const trimmedEmail = email.trim();
      console.log(`DatabaseStorage.getUserByEmail: zoeken naar gebruiker met email="${trimmedEmail}" (origineel: "${email}")`);
      
      const drizzleResult = await db.select().from(users).where(eq(users.email, trimmedEmail));
      
      const resultLength = drizzleResult?.length || 0;
      console.log(`DatabaseStorage.getUserByEmail: Drizzle resultaat: ${resultLength} gebruikers gevonden`);
      
      if (resultLength > 0 && drizzleResult[0]) {
        console.log(`DatabaseStorage.getUserByEmail: gebruiker gevonden met ID ${drizzleResult[0].id}`);
      } else {
        console.log(`DatabaseStorage.getUserByEmail: geen gebruiker gevonden met email=${trimmedEmail}`);
      }
      
      const [user] = drizzleResult;
      return user || undefined;
    } catch (error) {
      console.error(`DatabaseStorage.getUserByEmail: Fout bij ophalen gebruiker:`, error);
      throw error;
    }
  }
  
  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.firebaseUid, firebaseUid));
    return user || undefined;
  }
  
  async getUsersByRole(role: string): Promise<User[]> {
    return await db.select().from(users).where(eq(users.role, role));
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  async updateUser(id: number, data: Partial<Omit<InsertUser, 'password'>>): Promise<User | undefined> {
    const [updatedUser] = await db.update(users)
      .set({ ...data, lastLogin: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updatedUser || undefined;
  }
  
  async updateUserPassword(id: number, password: string): Promise<User | undefined> {
    const [updatedUser] = await db.update(users)
      .set({ password })
      .where(eq(users.id, id))
      .returning();
    return updatedUser || undefined;
  }
  
  async getUserByVerificationToken(token: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.verificationToken, token));
    return user || undefined;
  }
  
  async verifyUser(id: number): Promise<User | undefined> {
    const [user] = await db.update(users)
      .set({ 
        verified: true,
        verificationToken: null,
        verificationExpires: null 
      })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }
  
  async setVerificationToken(id: number, token: string, expires: Date): Promise<User | undefined> {
    const [user] = await db.update(users)
      .set({
        verificationToken: token,
        verificationExpires: expires
      })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  // Contact methods
  async createContact(insertContact: InsertContact): Promise<Contact> {
    const [contact] = await db.insert(contacts).values({
      ...insertContact,
      createdAt: new Date().toISOString(),
      read: false
    }).returning();
    return contact;
  }

  async getContacts(): Promise<Contact[]> {
    const result = await db.select().from(contacts);
    return result.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getContact(id: number): Promise<Contact | undefined> {
    const [contact] = await db.select().from(contacts).where(eq(contacts.id, id));
    return contact || undefined;
  }

  async markContactAsRead(id: number): Promise<Contact | undefined> {
    const [updatedContact] = await db.update(contacts)
      .set({ read: true })
      .where(eq(contacts.id, id))
      .returning();
    return updatedContact || undefined;
  }
  
  // Chat session methods
  async createChatSession(insertSession: InsertChatSession): Promise<ChatSession> {
    const now = new Date();
    const [session] = await db.insert(chatSessions).values({
      ...insertSession,
      createdAt: now,
      lastActivity: now
    }).returning();
    return session;
  }
  
  async getChatSession(sessionId: string): Promise<ChatSession | undefined> {
    const [session] = await db.select().from(chatSessions).where(eq(chatSessions.sessionId, sessionId));
    return session || undefined;
  }
  
  async updateChatSessionPreferences(sessionId: string, preferences: any): Promise<ChatSession | undefined> {
    const [updatedSession] = await db.update(chatSessions)
      .set({ 
        preferences,
        lastActivity: new Date()
      })
      .where(eq(chatSessions.sessionId, sessionId))
      .returning();
    return updatedSession || undefined;
  }
  
  async updateChatSessionActivity(sessionId: string): Promise<ChatSession | undefined> {
    const [updatedSession] = await db.update(chatSessions)
      .set({ lastActivity: new Date() })
      .where(eq(chatSessions.sessionId, sessionId))
      .returning();
    return updatedSession || undefined;
  }
  
  // Chat message methods
  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    // Update session activity when message is created
    await this.updateChatSessionActivity(insertMessage.sessionId);
    
    const [message] = await db.insert(chatMessages)
      .values(insertMessage)
      .returning();
    return message;
  }
  
  async getChatMessages(sessionId: string, limit: number = 50): Promise<ChatMessage[]> {
    const messages = await db.select()
      .from(chatMessages)
      .where(eq(chatMessages.sessionId, sessionId))
      .orderBy(desc(chatMessages.timestamp))
      .limit(limit);
    
    // Return messages in chronological order
    return messages.reverse();
  }
  
  // Project methods
  async createProject(insertProject: InsertProject): Promise<Project> {
    try {
      console.log(`DatabaseStorage.createProject: creating project with name "${insertProject.name}" for user ID ${insertProject.userId}`);
      
      // Loggen van alle velden in het project
      console.log(`DatabaseStorage.createProject: project data:`, JSON.stringify(insertProject, null, 2));
      
      const [project] = await db.insert(projects)
        .values({
          ...insertProject,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();
      
      if (project) {
        console.log(`DatabaseStorage.createProject: project succesvol aangemaakt met ID ${project.id}`);
      } else {
        console.error(`DatabaseStorage.createProject: project aangemaakt, maar geen project teruggegeven`);
      }
      
      return project;
    } catch (error) {
      console.error(`DatabaseStorage.createProject: fout bij aanmaken project:`, error);
      throw error;
    }
  }
  
  async getProject(id: number): Promise<Project | undefined> {
    try {
      console.log(`DatabaseStorage.getProject: ophalen project met ID ${id}`);
      
      const [project] = await db.select()
        .from(projects)
        .where(eq(projects.id, id));
      
      if (project) {
        console.log(`DatabaseStorage.getProject: project gevonden met ID ${id}: "${project.name}"`);
      } else {
        console.log(`DatabaseStorage.getProject: geen project gevonden met ID ${id}`);
      }
      
      return project || undefined;
    } catch (error) {
      console.error(`DatabaseStorage.getProject: fout bij ophalen project:`, error);
      throw error;
    }
  }
  
  async getUserProjects(userId: number): Promise<Project[]> {
    try {
      console.log(`DatabaseStorage.getUserProjects: ophalen projecten voor gebruiker met ID ${userId}`);
      
      const userProjects = await db.select()
        .from(projects)
        .where(eq(projects.userId, userId))
        .orderBy(desc(projects.updatedAt));
      
      console.log(`DatabaseStorage.getUserProjects: ${userProjects.length} projecten gevonden voor gebruiker ${userId}`);
      
      return userProjects;
    } catch (error) {
      console.error(`DatabaseStorage.getUserProjects: fout bij ophalen projecten:`, error);
      throw error;
    }
  }
  
  async getAllProjects(): Promise<Project[]> {
    try {
      console.log(`DatabaseStorage.getAllProjects: ophalen alle projecten`);
      
      const allProjects = await db.select()
        .from(projects)
        .orderBy(desc(projects.updatedAt));
      
      console.log(`DatabaseStorage.getAllProjects: ${allProjects.length} projecten gevonden`);
      
      return allProjects;
    } catch (error) {
      console.error(`DatabaseStorage.getAllProjects: fout bij ophalen alle projecten:`, error);
      throw error;
    }
  }
  
  async updateProject(id: number, data: Partial<InsertProject>): Promise<Project | undefined> {
    try {
      console.log(`DatabaseStorage.updateProject: bijwerken project met ID ${id}`);
      console.log(`DatabaseStorage.updateProject: update data:`, JSON.stringify(data, null, 2));
      
      const [updatedProject] = await db.update(projects)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(projects.id, id))
        .returning();
      
      if (updatedProject) {
        console.log(`DatabaseStorage.updateProject: project bijgewerkt met ID ${id}: "${updatedProject.name}"`);
      } else {
        console.log(`DatabaseStorage.updateProject: geen project gevonden met ID ${id} om bij te werken`);
      }
      
      return updatedProject || undefined;
    } catch (error) {
      console.error(`DatabaseStorage.updateProject: fout bij bijwerken project:`, error);
      throw error;
    }
  }
  
  async deleteProject(id: number): Promise<boolean> {
    try {
      console.log(`DatabaseStorage.deleteProject: verwijderen project met ID ${id}`);
      
      const result = await db.delete(projects)
        .where(eq(projects.id, id))
        .returning();
      
      const success = result.length > 0;
      console.log(`DatabaseStorage.deleteProject: project ${success ? 'succesvol verwijderd' : 'niet gevonden'}`);
      
      return success;
    } catch (error) {
      console.error(`DatabaseStorage.deleteProject: fout bij verwijderen project:`, error);
      throw error;
    }
  }
  
  // Milestone methods
  async createMilestone(insertMilestone: InsertMilestone): Promise<Milestone> {
    const [milestone] = await db.insert(milestones)
      .values({
        ...insertMilestone,
        createdAt: new Date()
      })
      .returning();
    return milestone;
  }
  
  async getMilestone(id: number): Promise<Milestone | undefined> {
    const [milestone] = await db.select()
      .from(milestones)
      .where(eq(milestones.id, id));
    return milestone || undefined;
  }
  
  async getProjectMilestones(projectId: number): Promise<Milestone[]> {
    const projectMilestones = await db.select()
      .from(milestones)
      .where(eq(milestones.projectId, projectId))
      .orderBy(milestones.order);
    return projectMilestones;
  }
  
  async updateMilestone(id: number, data: Partial<InsertMilestone>): Promise<Milestone | undefined> {
    const [updatedMilestone] = await db.update(milestones)
      .set(data)
      .where(eq(milestones.id, id))
      .returning();
    return updatedMilestone || undefined;
  }
  
  async deleteMilestone(id: number): Promise<boolean> {
    const result = await db.delete(milestones)
      .where(eq(milestones.id, id))
      .returning();
    return result.length > 0;
  }
  
  // Project file methods
  async createProjectFile(insertFile: InsertProjectFile): Promise<ProjectFile> {
    const [file] = await db.insert(projectFiles)
      .values({
        ...insertFile,
        createdAt: new Date()
      })
      .returning();
    return file;
  }
  
  async getProjectFile(id: number): Promise<ProjectFile | undefined> {
    const [file] = await db.select()
      .from(projectFiles)
      .where(eq(projectFiles.id, id));
    return file || undefined;
  }
  
  async getProjectFiles(projectId: number): Promise<ProjectFile[]> {
    const files = await db.select()
      .from(projectFiles)
      .where(eq(projectFiles.projectId, projectId))
      .orderBy(desc(projectFiles.createdAt));
    return files;
  }
  
  async deleteProjectFile(id: number): Promise<boolean> {
    const result = await db.delete(projectFiles)
      .where(eq(projectFiles.id, id))
      .returning();
    return result.length > 0;
  }
  
  // Notification methods
  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const [notification] = await db.insert(notifications)
      .values({
        ...insertNotification,
        createdAt: new Date()
      })
      .returning();
    return notification;
  }
  
  async getUserNotifications(userId: number): Promise<Notification[]> {
    const userNotifications = await db.select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
    return userNotifications;
  }
  
  async getUnreadNotificationCount(userId: number): Promise<number> {
    const unreadNotifications = await db.select()
      .from(notifications)
      .where(and(
        eq(notifications.userId, userId),
        eq(notifications.read, false)
      ));
    return unreadNotifications.length;
  }
  
  async markNotificationAsRead(id: number): Promise<Notification | undefined> {
    const [updatedNotification] = await db.update(notifications)
      .set({ read: true })
      .where(eq(notifications.id, id))
      .returning();
    return updatedNotification || undefined;
  }
  
  async markAllNotificationsAsRead(userId: number): Promise<boolean> {
    const result = await db.update(notifications)
      .set({ read: true })
      .where(and(
        eq(notifications.userId, userId),
        eq(notifications.read, false)
      ))
      .returning();
    return result.length > 0;
  }
  
  async deleteNotification(id: number): Promise<boolean> {
    const result = await db.delete(notifications)
      .where(eq(notifications.id, id))
      .returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
