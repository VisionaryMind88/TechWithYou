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

// Test voor verschillende wachtwoord vergelijkingsfuncties
async function testComparePasswords() {
  let client;
  try {
    // Test wachtwoord
    const password = 'admin123';
    
    // Database client krijgen
    client = await pool.connect();
    
    // Haal de huidige hash op uit de database
    const result = await client.query(
      `SELECT password FROM users WHERE username = 'admin'`
    );
    
    if (result.rows.length === 0) {
      console.error('Admin gebruiker niet gevonden');
      process.exit(1);
    }
    
    const storedHash = result.rows[0].password;
    console.log(`\nHuidige hash in database: ${storedHash}`);
    
    // Probeer het wachtwoord met de applicatiecode te vergelijken
    console.log('\n---- Test 1: applicatiecode voor wachtwoordvergelijking ----');
    
    // Split de hash en salt
    const [hashed, salt] = storedHash.split(".");
    
    if (!salt) {
      console.error('Onjuist hash format, geen salt gevonden');
      process.exit(1);
    }
    
    // Verify using method 1: de standaard methode uit de code
    const hashedBuf = Buffer.from(hashed, "hex");
    const suppliedBuf = (await scryptAsync(password, salt, 64)) as Buffer;
    const match1 = timingSafeEqual(hashedBuf, suppliedBuf);
    
    console.log(`Methode 1 resultaat: ${match1 ? 'MATCH' : 'GEEN MATCH'}`);
    
    // Nu slaan we een nieuw wachtwoord op om zeker te weten dat het werkt
    const newSalt = randomBytes(16).toString("hex");
    const newBuf = (await scryptAsync(password, newSalt, 64)) as Buffer;
    const newHashedPassword = `${newBuf.toString("hex")}.${newSalt}`;
    
    console.log('\n---- Test 2: nieuw wachtwoord opslaan en vergelijken ----');
    console.log(`Nieuwe hash: ${newHashedPassword}`);
    
    // Update het wachtwoord in de database
    await client.query(`
      UPDATE users 
      SET password = $1 
      WHERE username = 'admin'
    `, [newHashedPassword]);
    
    console.log('Wachtwoord bijgewerkt in de database');
    
    // Haal het wachtwoord opnieuw op voor verificatie
    const verifyResult = await client.query(
      `SELECT password FROM users WHERE username = 'admin'`
    );
    
    const verifyHash = verifyResult.rows[0].password;
    console.log(`Geverifieerde hash in database: ${verifyHash}`);
    
    // Test of het identiek is
    console.log(`Hash is identiek: ${verifyHash === newHashedPassword ? 'JA' : 'NEE'}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Fout bij het testen van wachtwoord vergelijking:', error);
    process.exit(1);
  } finally {
    if (client) client.release();
  }
}

testComparePasswords().catch(err => {
  console.error('Onbehandelde fout:', err);
  process.exit(1);
});