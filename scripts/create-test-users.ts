import { promisify } from "util";
import { scrypt, randomBytes } from "crypto";
import { db } from "../server/db";
import { users } from "../shared/schema";
import { eq } from "drizzle-orm";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function createTestUsers() {
  try {
    // Create admin user
    const adminPassword = await hashPassword("admin123");
    const adminExists = await db.select().from(users).where(eq(users.username, "admin"));
    
    if (adminExists.length === 0) {
      const admin = await db.insert(users).values({
        username: "admin",
        password: adminPassword,
        email: "admin@digitaalatelier.com",
        name: "Admin User",
        role: "admin",
        company: "Digitaal Atelier",
      }).returning();
      
      console.log("Admin user created:", admin[0].username);
    } else {
      console.log("Admin user already exists");
    }
    
    // Create client user
    const clientPassword = await hashPassword("client123");
    const clientExists = await db.select().from(users).where(eq(users.username, "client"));
    
    if (clientExists.length === 0) {
      const client = await db.insert(users).values({
        username: "client",
        password: clientPassword,
        email: "client@example.com",
        name: "Test Client",
        role: "client",
        company: "Example Company",
      }).returning();
      
      console.log("Client user created:", client[0].username);
    } else {
      console.log("Client user already exists");
    }
    
    console.log("Test users created successfully!");
    console.log("\nAdmin credentials:");
    console.log("Username: admin");
    console.log("Password: admin123");
    console.log("\nClient credentials:");
    console.log("Username: client");
    console.log("Password: client123");
    
  } catch (error) {
    console.error("Error creating test users:", error);
  } finally {
    process.exit(0);
  }
}

createTestUsers();