import { initializeApp, cert, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { Request, Response, NextFunction } from 'express';
import { storage } from './storage';
import { InsertUser } from '@shared/schema';
import { emailService } from './email-service';

// Firebase Admin initialiseren
let firebaseApp: App;

try {
  // Initialiseren met de projectId uit de environment variabele
  firebaseApp = initializeApp({
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  });
  console.log("Firebase Admin initialisatie succesvol");
} catch (error) {
  console.error("Firebase Admin initialisatie mislukt:", error);
}

// De Firebase token verifiëren en de gebruiker opzoeken of aanmaken in onze database
export async function verifyFirebaseToken(token: string) {
  try {
    // Token verifiëren
    const decodedToken = await getAuth(firebaseApp).verifyIdToken(token);
    
    // Gebruikersgegevens ophalen
    const { uid, email, name, picture } = decodedToken;
    
    if (!email) {
      throw new Error("Email is required");
    }
    
    // Zoek bestaande gebruiker op basis van Firebase UID
    let user = await storage.getUserByFirebaseUid(uid);
    
    // Als de gebruiker niet bestaat, zoek dan op email
    if (!user) {
      user = await storage.getUserByEmail(email);
    }
    
    // Als gebruiker bestaat, Firebase UID updaten indien nodig
    if (user) {
      if (!user.firebase_uid) {
        await storage.updateUser(user.id, { firebase_uid: uid });
      }
      return user;
    }
    
    // Als gebruiker niet bestaat, nieuwe gebruiker aanmaken
    const username = email.split('@')[0]; // Eenvoudige username op basis van email
    
    // Controleren of username al bestaat, zo ja, uniek maken
    let existingUser = await storage.getUserByUsername(username);
    let uniqueUsername = username;
    let counter = 1;
    
    while (existingUser) {
      uniqueUsername = `${username}${counter}`;
      existingUser = await storage.getUserByUsername(uniqueUsername);
      counter++;
    }
    
    // Nieuwe gebruiker aanmaken
    const newUser: InsertUser = {
      username: uniqueUsername,
      email,
      password: '', // Geen wachtwoord nodig voor sociale login
      name: name || uniqueUsername,
      role: 'client',
      firebase_uid: uid,
      verified: true, // Social login gebruikers zijn al geverifieerd
      profile_image: picture || null,
    };
    
    return await storage.createUser(newUser);
  } catch (error) {
    console.error('Firebase token verificatie mislukt:', error);
    throw error;
  }
}

// Middleware om Firebase token te verifiëren vanuit de Authorization header
export async function firebaseAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // Geen token gevonden, doorgaan naar volgende middleware
    }
    
    const token = authHeader.split('Bearer ')[1];
    if (!token) {
      return next();
    }
    
    // Token verifiëren en gebruiker ophalen of aanmaken
    const user = await verifyFirebaseToken(token);
    
    // Gebruiker inloggen via Passport sessie
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      next();
    });
  } catch (error) {
    next(error);
  }
}