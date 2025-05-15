import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';

// Laad de environment variabelen
dotenv.config();

const scryptAsync = promisify(scrypt);

// Database connectie instellen
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Nodig voor Supabase
});

// Exact dezelfde functie als in server/auth.ts
async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function resetAdmin() {
  let client;
  try {
    // Nieuw wachtwoord voor admin: admin123
    const password = 'admin123';
    const hashedPassword = await hashPassword(password);
    
    // Database client krijgen
    client = await pool.connect();
    
    // Update admin wachtwoord
    await client.query(`
      UPDATE users 
      SET password = $1 
      WHERE username = 'admin'
    `, [hashedPassword]);
    
    console.log(`Admin wachtwoord bijgewerkt met de exacte hash methode uit de applicatie`);
    console.log(`Gebruikersnaam: admin`);
    console.log(`Wachtwoord: ${password}`);
    
    // Nu proberen we het wachtwoord te verifiëren met de compare functie
    const result = await client.query(
      `SELECT password FROM users WHERE username = 'admin'`
    );
    
    if (result.rows.length > 0) {
      const storedHash = result.rows[0].password;
      console.log(`Opgeslagen hash: ${storedHash}`);
      
      // Parse hash en salt
      const [hashed, salt] = storedHash.split(".");
      if (!salt) {
        console.error('Onjuist hash format, geen salt gevonden');
        process.exit(1);
      }
      
      // Verifieer dat de functie werkt
      const hashedBuf = Buffer.from(hashed, "hex");
      const suppliedBuf = (await scryptAsync(password, salt, 64)) as Buffer;
      const match = timingSafeEqual(hashedBuf, suppliedBuf);
      
      console.log(`Wachtwoord verificatie test: ${match ? 'GESLAAGD' : 'MISLUKT'}`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Fout bij het resetten van admin wachtwoord:', error);
    process.exit(1);
  } finally {
    if (client) client.release();
  }
}

resetAdmin().catch(err => {
  console.error('Onbehandelde fout:', err);
  process.exit(1);
});