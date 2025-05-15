const { scrypt, randomBytes } = require('crypto');
const { promisify } = require('util');
const { Pool } = require('pg');
const dotenv = require('dotenv');

// Laad environment variabelen
dotenv.config();

// Database connectie instellen
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Nodig voor Supabase
});

const scryptAsync = promisify(scrypt);

async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString('hex')}.${salt}`;
}

async function resetAdminPassword() {
  let client;
  try {
    // Nieuw wachtwoord voor admin
    const newPassword = 'admin123';
    const hashedPassword = await hashPassword(newPassword);
    
    // Database client krijgen
    client = await pool.connect();
    
    // Update de admin gebruiker (user met id 1)
    await client.query(`
      UPDATE users 
      SET password = $1 
      WHERE id = 1
    `, [hashedPassword]);
    
    console.log(`Admin wachtwoord is gereset naar: ${newPassword}`);
    console.log('Je kunt nu inloggen met:');
    console.log('Gebruikersnaam: admin');
    console.log(`Wachtwoord: ${newPassword}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Fout bij het resetten van het admin wachtwoord:', error);
    process.exit(1);
  } finally {
    if (client) {
      client.release();
    }
  }
}

// Voer de functie uit
resetAdminPassword();