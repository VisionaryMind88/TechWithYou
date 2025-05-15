import * as dotenv from 'dotenv';
import { storage } from '../server/storage';

// Laad de environment variabelen
dotenv.config();

async function testStorage() {
  try {
    console.log('Testing getUserByUsername method...');
    
    // Test met admin gebruiker
    const adminUser = await storage.getUserByUsername('admin');
    
    if (adminUser) {
      console.log('Admin user found in database:');
      const { password, ...userWithoutPassword } = adminUser;
      console.log(userWithoutPassword);
    } else {
      console.log('Admin user NOT found in database');
    }
    
    // Test met niet-bestaande gebruiker
    const nonExistentUser = await storage.getUserByUsername('doesnotexist');
    console.log('Non-existent user found:', nonExistentUser ? 'YES (unexpected)' : 'NO (expected)');
    
    // Test getUserByEmail
    console.log('\nTesting getUserByEmail method...');
    const userByEmail = await storage.getUserByEmail('admin@digitaalatelier.com');
    
    if (userByEmail) {
      console.log('User found by email:');
      const { password, ...userWithoutPassword } = userByEmail;
      console.log(userWithoutPassword);
    } else {
      console.log('User NOT found by email');
    }
  } catch (error) {
    console.error('Error during storage test:', error);
  }
}

testStorage().catch(err => {
  console.error('Unhandled error:', err);
}).finally(() => {
  // Afsluiten na voltooiing
  setTimeout(() => process.exit(0), 500);
});