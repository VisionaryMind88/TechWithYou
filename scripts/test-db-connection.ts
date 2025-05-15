import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import { users } from '../shared/schema';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';

// Laad de environment variabelen
dotenv.config();

async function testDatabaseConnection() {
  // Standaard postgres pool
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Nodig voor Supabase
  });
  
  try {
    console.log('\n==== Directe Postgres Query ====');
    // Test directe connectie
    const client = await pool.connect();
    try {
      console.log('Database connectie succesvol!');
      
      // Haal alle tabellen op
      const { rows: tables } = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name
      `);
      
      console.log('\nDatabasetabellen:');
      tables.forEach((table, i) => {
        console.log(`${i+1}. ${table.table_name}`);
      });
      
      // Probeer gebruikers op te halen
      const { rows: userRows } = await client.query('SELECT * FROM users');
      console.log(`\nAantal gebruikers in database: ${userRows.length}`);
      
      // Zoek specifiek naar admin gebruiker
      const { rows: adminRows } = await client.query("SELECT * FROM users WHERE username = 'admin'");
      console.log(`\nAantal admin gebruikers gevonden: ${adminRows.length}`);
      
      if (adminRows.length > 0) {
        console.log('\nAdmin gebruiker gevonden:');
        // Print veilige velden (niet het wachtwoord)
        const { password, ...safeAdminInfo } = adminRows[0];
        console.log(safeAdminInfo);
      }
    } finally {
      client.release();
    }
    
    // Drizzle ORM test
    const drizzleDB = drizzle(pool);
    console.log('\n==== Drizzle ORM Query ====');
    
    try {
      // Probeer alle gebruikers op te halen
      const allUsers = await drizzleDB.select().from(users);
      console.log(`Aantal gebruikers via Drizzle: ${allUsers.length}`);
      
      // Zoek naar admin gebruiker
      const adminUsers = await drizzleDB.select().from(users).where(eq(users.username, 'admin'));
      console.log(`Aantal admin gebruikers via Drizzle: ${adminUsers.length}`);
      
      if (adminUsers.length > 0) {
        console.log('\nAdmin gebruiker via Drizzle:');
        const { password, ...safeAdminInfo } = adminUsers[0];
        console.log(safeAdminInfo);
      }
    } catch (error) {
      console.error('Fout bij Drizzle ORM query:', error);
    }
  } catch (error) {
    console.error('Fout bij databaseconnectie:', error);
  } finally {
    await pool.end();
  }
}

testDatabaseConnection().catch(err => {
  console.error('Onbehandelde fout:', err);
  process.exit(1);
});