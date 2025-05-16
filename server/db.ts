import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Maak een Supabase project aan en configureer de DATABASE_URL.",
  );
}

// Create a PostgreSQL pool for Supabase connection with retry capabilities
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Nodig voor Supabase en Railway
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 5000, // How long to wait for a connection to become available
});

// Log database connection status
pool.on('connect', () => {
  console.log('Connected to Supabase PostgreSQL database');
});

// Improved error handling for database connection issues
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  // Instead of immediately terminating, log the error and let the application handle reconnection
  // process.exit(-1) was removed to prevent entire application from crashing
});

// Initialize Drizzle with the pool
export const db = drizzle(pool, { schema });