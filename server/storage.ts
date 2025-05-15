import { 
  users, type User, type InsertUser, 
  contacts, type Contact, type InsertContact,
  chatSessions, type ChatSession, type InsertChatSession,
  chatMessages, type ChatMessage, type InsertChatMessage
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
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
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
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
}

export const storage = new DatabaseStorage();
