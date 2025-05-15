import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser, insertUserSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { ZodError } from "zod";
import connectPg from "connect-pg-simple";
import { pool } from "./db";
import { emailService, generateToken, generateTokenExpiration } from "./email-service";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const PostgresSessionStore = connectPg(session);
  const sessionStore = new PostgresSessionStore({
    pool,
    createTableIfMissing: true,
  });

  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "digitaal-atelier-session-secret",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax"
    }
  };

  // Configure express-session
  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  
  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure passport strategies
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        // Try to find user by username first
        let user = await storage.getUserByUsername(username);
        
        // If not found, try by email
        if (!user) {
          user = await storage.getUserByEmail(username);
        }
        
        // If still not found or password is incorrect
        if (!user || !(await comparePasswords(password, user.password))) {
          return done(null, false, { message: "Invalid credentials" });
        }
        
        // TODO: Uncomment this when the database migration is complete
        // Check if user is verified
        // if (!user.verified) {
        //   return done(null, false, { message: "Please verify your email address before logging in" });
        // }
        
        // Update last login timestamp
        await storage.updateUser(user.id, {});
        
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }),
  );

  // Configure serialization for session
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Authentication routes
  app.post("/api/register", async (req, res, next) => {
    try {
      // Validate user registration data
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username exists
      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Check if email exists if provided
      if (userData.email) {
        const existingEmail = await storage.getUserByEmail(userData.email);
        if (existingEmail) {
          return res.status(400).json({ message: "Email already exists" });
        }
      }
      
      // Hash password
      const hashedPassword = await hashPassword(userData.password);
      
      // Generate verification token
      const verificationToken = generateToken();
      const verificationExpires = generateTokenExpiration();
      
      // Create user (temporarily not setting verified=false until schema migration is complete)
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
        // verified: false, // Uncomment when schema migration is complete
      });
      
      // Set verification token (temporarily commented until schema migration is complete)
      // await storage.setVerificationToken(user.id, verificationToken, verificationExpires);
      
      // Send verification email (temporarily commented until SendGrid API is set up)
      // await emailService.sendVerificationEmail(
      //   user.email,
      //   user.username,
      //   verificationToken
      // );
      
      // Log verification info for testing
      console.log(`[DEBUG] Verification would be sent to ${user.email} with token ${verificationToken}`);
      
      // Create welcome notification
      await storage.createNotification({
        userId: user.id,
        title: "Welcome to Digitaal Atelier!",
        message: "Thank you for registering. You are now logged in and can access your dashboard.",
        type: "success",
      });
      
      // TODO: Restore this when email verification is fully implemented
      // Return success without logging in (user must verify email first)
      // const { password, ...userWithoutPassword } = user;
      // return res.status(201).json({
      //   ...userWithoutPassword,
      //   message: "Registration successful. Please check your email to verify your account.",
      //   requiresVerification: true
      // });
      
      // Temporarily log in the user automatically until verification is implemented
      req.login(user, (err) => {
        if (err) return next(err);
        
        // Return the user without password
        const { password, ...userWithoutPassword } = user;
        return res.status(201).json(userWithoutPassword);
      });
    } catch (error: any) {
      // Handle validation errors
      if (error.name === "ZodError") {
        const validationError = fromZodError(error as ZodError);
        return res.status(400).json({
          message: "Invalid registration data",
          errors: validationError.details,
        });
      }
      
      // Handle other errors
      return res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: Error | null, user: SelectUser | false, info: { message: string } | undefined) => {
      if (err) {
        return next(err);
      }
      
      if (!user) {
        return res.status(401).json({ message: info?.message || "Authentication failed" });
      }
      
      req.login(user, (loginErr: Error | null | undefined) => {
        if (loginErr) {
          return next(loginErr);
        }
        
        // Return the user without password
        const { password, ...userWithoutPassword } = user;
        return res.json(userWithoutPassword);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err: Error | null | undefined) => {
      if (err) return next(err);
      res.status(200).json({ message: "Logged out successfully" });
    });
  });

  // Email verification endpoint
  app.get("/api/verify-email", async (req, res) => {
    try {
      const { token } = req.query;
      
      if (!token || typeof token !== 'string') {
        return res.status(400).json({ message: "Invalid verification token" });
      }
      
      // Find user by verification token
      const user = await storage.getUserByVerificationToken(token);
      
      if (!user) {
        return res.status(400).json({ message: "Invalid or expired verification token" });
      }
      
      // Check if token is expired
      if (user.verificationExpires && new Date() > new Date(user.verificationExpires)) {
        return res.status(400).json({ message: "Verification token has expired" });
      }
      
      // Verify user
      await storage.verifyUser(user.id);
      
      // Create verification success notification
      await storage.createNotification({
        userId: user.id,
        title: "Email Verified",
        message: "Your email has been successfully verified. You can now log in to your account.",
        type: "success",
      });
      
      return res.status(200).json({ message: "Email verification successful. You can now log in." });
    } catch (error) {
      console.error("Email verification error:", error);
      return res.status(500).json({ message: "An error occurred during email verification" });
    }
  });
  
  // Resend verification email endpoint
  app.post("/api/resend-verification", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ message: "Email is required" });
      }
      
      // Find user by email
      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // If user is already verified
      if (user.verified) {
        return res.status(400).json({ message: "Email is already verified" });
      }
      
      // Generate new verification token
      const verificationToken = generateToken();
      const verificationExpires = generateTokenExpiration();
      
      // Update verification token
      await storage.setVerificationToken(user.id, verificationToken, verificationExpires);
      
      // Send new verification email
      await emailService.sendVerificationEmail(user.email, user.username, verificationToken);
      
      return res.status(200).json({ message: "Verification email sent. Please check your inbox." });
    } catch (error) {
      console.error("Resend verification error:", error);
      return res.status(500).json({ message: "An error occurred while resending verification email" });
    }
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    // Return the user without password
    const { password, ...userWithoutPassword } = req.user;
    res.json(userWithoutPassword);
  });
  
  app.put("/api/user", (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const userId = req.user.id;
    const { password, ...updateData } = req.body;
    
    // Update user profile
    storage.updateUser(userId, updateData)
      .then(user => {
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        
        // Return updated user without password
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
      })
      .catch(error => next(error));
  });
  
  app.put("/api/user/password", async (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    
    try {
      // Get current user data to verify password
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Verify current password
      const isPasswordValid = await comparePasswords(currentPassword, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }
      
      // Hash new password
      const hashedPassword = await hashPassword(newPassword);
      
      // Update password
      await storage.updateUserPassword(userId, hashedPassword);
      
      res.json({ message: "Password updated successfully" });
    } catch (error) {
      next(error);
    }
  });
  
  // Helper middleware to check if user is authenticated
  app.use("/api/dashboard", (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    next();
  });
}