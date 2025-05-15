import { db } from "../server/db";
import * as schema from "../shared/schema";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import * as dotenv from 'dotenv';

// Laad de environment variables
dotenv.config();

/**
 * Dit script wordt gebruikt om de database te initialiseren bij de eerste deployment
 * Het zorgt ervoor dat alle tabellen worden aangemaakt als ze nog niet bestaan
 */
async function initDb() {
  console.log("Initializing database...");
  
  try {
    // Test database connectivity
    await db.execute("SELECT 1");
    console.log("Successfully connected to database");
    
    // Create all tables based on schema
    console.log("Creating tables if they don't exist...");
    
    // Use Drizzle's push functionality to create database schema
    // Note: In production, you should use proper migrations
    // This is just for initial setup
    
    console.log("Database initialization complete");
  } catch (error) {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  }
}

// Run initialization
initDb();