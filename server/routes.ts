import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertContactSchema, 
  insertProjectSchema,
  insertMilestoneSchema,
  insertProjectFileSchema,
  insertNotificationSchema
} from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { ZodError } from "zod";
import { setupAuth } from "./auth";
import { emailService } from "./email-service";
import { verifyFirebaseToken } from "./firebase-auth";

// Middleware to check if user is authenticated
function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
}

// Helper function to assert user exists in authenticated routes
function assertUser(req: Request, res: Response): Express.User | null {
  // @ts-ignore - req.user is defined because we use requireAuth middleware before
  const user = req.user;
  if (!user) {
    res.status(401).json({ message: "Authentication required" });
    return null;
  }
  return user;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);
  
  // Firebase authentication endpoint
  app.post('/api/auth/firebase', async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json({ message: "Token is required" });
      }
      
      // Verifieer Firebase token en haal gebruiker op
      const user = await verifyFirebaseToken(token);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid token or user not found" });
      }
      
      // Log gebruiker in met passport
      req.login(user, (err) => {
        if (err) {
          console.error('Firebase auth login error:', err);
          return res.status(500).json({ message: "Authentication error" });
        }
        
        return res.status(200).json(user);
      });
    } catch (error) {
      console.error('Firebase auth error:', error);
      res.status(500).json({ message: "Authentication failed" });
    }
  });
  
  // Resend verification email endpoint
  app.post('/api/resend-verification', async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      
      // Find user by email
      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        // Don't reveal if email exists or not for security
        return res.status(200).json({ message: "If your email exists, a verification link has been sent." });
      }
      
      // If user is already verified
      if (user.verified) {
        return res.status(400).json({ message: "Email is already verified" });
      }
      
      // Generate new verification token
      const verificationToken = emailService.generateToken();
      const verificationExpires = emailService.generateTokenExpiration();
      
      // Update token in database
      await storage.setVerificationToken(user.id, verificationToken, verificationExpires);
      
      // Send verification email (temporarily commented until SendGrid API is set up)
      // await emailService.sendVerificationEmail(
      //   user.email,
      //   user.username,
      //   verificationToken
      // );
      
      // Log verification info for testing
      console.log(`[DEBUG] Verification resent to ${user.email} with token ${verificationToken}`);
      
      return res.status(200).json({ message: "Verification email sent successfully" });
    } catch (error) {
      console.error("Resend verification error:", error);
      return res.status(500).json({ message: "Failed to resend verification email" });
    }
  });
  
  // API endpoint for contact form
  app.post('/api/contact', async (req: Request, res: Response) => {
    try {
      // Validate contact form submission
      const contactData = insertContactSchema.parse(req.body);
      
      // Store contact form submission
      const contact = await storage.createContact(contactData);
      
      // Return success response
      return res.status(201).json({
        message: 'Contact form submitted successfully',
        contactId: contact.id
      });
    } catch (error: any) {
      // Handle validation errors
      if (error.name === 'ZodError') {
        const validationError = fromZodError(error as ZodError);
        return res.status(400).json({
          message: 'Invalid form data',
          errors: validationError.details
        });
      }
      
      // Handle other errors
      return res.status(500).json({
        message: 'Failed to submit contact form'
      });
    }
  });

  // Dashboard API routes
  app.get('/api/dashboard/projects', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = assertUser(req, res);
      if (!user) return;
      
      const userId = user.id;
      const projects = await storage.getUserProjects(userId);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch projects' });
    }
  });
  
  app.post('/api/dashboard/projects', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = assertUser(req, res);
      if (!user) return;
      
      const userId = user.id;
      const projectData = insertProjectSchema.parse({
        ...req.body,
        userId
      });
      
      const project = await storage.createProject(projectData);
      
      // Create a notification about the new project
      await storage.createNotification({
        userId,
        title: 'New Project Created',
        message: `Your project '${project.name}' has been created successfully.`,
        type: 'success'
      });
      
      res.status(201).json(project);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const validationError = fromZodError(error as ZodError);
        return res.status(400).json({
          message: 'Invalid project data',
          errors: validationError.details
        });
      }
      
      res.status(500).json({ message: 'Failed to create project' });
    }
  });
  
  app.get('/api/dashboard/projects/:id', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = assertUser(req, res);
      if (!user) return;
      
      const projectId = parseInt(req.params.id, 10);
      const project = await storage.getProject(projectId);
      
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      
      // Ensure user owns this project
      if (project.userId !== user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch project' });
    }
  });
  
  app.put('/api/dashboard/projects/:id', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = assertUser(req, res);
      if (!user) return;
      
      const projectId = parseInt(req.params.id, 10);
      const project = await storage.getProject(projectId);
      
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      
      // Ensure user owns this project
      if (project.userId !== user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      const updatedProject = await storage.updateProject(projectId, req.body);
      res.json(updatedProject);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update project' });
    }
  });
  
  app.delete('/api/dashboard/projects/:id', requireAuth, async (req: Request, res: Response) => {
    try {
      const projectId = parseInt(req.params.id, 10);
      const project = await storage.getProject(projectId);
      
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      
      // Ensure user owns this project
      if (project.userId !== req.user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      await storage.deleteProject(projectId);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete project' });
    }
  });
  
  // Project files API routes
  app.get('/api/dashboard/projects/:projectId/files', requireAuth, async (req: Request, res: Response) => {
    try {
      const projectId = parseInt(req.params.projectId, 10);
      const project = await storage.getProject(projectId);
      
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      
      // Ensure user owns this project or is an admin
      if (project.userId !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      const files = await storage.getProjectFiles(projectId);
      res.json(files);
    } catch (error) {
      console.error('Error fetching project files:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Milestones API routes
  app.get('/api/dashboard/projects/:projectId/milestones', requireAuth, async (req: Request, res: Response) => {
    try {
      const projectId = parseInt(req.params.projectId, 10);
      const project = await storage.getProject(projectId);
      
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      
      // Ensure user owns this project
      if (project.userId !== req.user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      const milestones = await storage.getProjectMilestones(projectId);
      res.json(milestones);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch milestones' });
    }
  });
  
  app.post('/api/dashboard/projects/:projectId/milestones', requireAuth, async (req: Request, res: Response) => {
    try {
      const projectId = parseInt(req.params.projectId, 10);
      const project = await storage.getProject(projectId);
      
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      
      // Ensure user owns this project
      if (project.userId !== req.user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      const milestoneData = insertMilestoneSchema.parse({
        ...req.body,
        projectId
      });
      
      const milestone = await storage.createMilestone(milestoneData);
      res.status(201).json(milestone);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const validationError = fromZodError(error as ZodError);
        return res.status(400).json({
          message: 'Invalid milestone data',
          errors: validationError.details
        });
      }
      
      res.status(500).json({ message: 'Failed to create milestone' });
    }
  });
  
  // Notifications API routes
  app.get('/api/dashboard/notifications', requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      const notifications = await storage.getUserNotifications(userId);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch notifications' });
    }
  });
  
  app.get('/api/dashboard/notifications/unread/count', requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      const count = await storage.getUnreadNotificationCount(userId);
      res.json({ count });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch notification count' });
    }
  });
  
  app.post('/api/dashboard/notifications/read/:id', requireAuth, async (req: Request, res: Response) => {
    try {
      const notificationId = parseInt(req.params.id, 10);
      await storage.markNotificationAsRead(notificationId);
      res.status(200).json({ message: 'Notification marked as read' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to mark notification as read' });
    }
  });
  
  app.post('/api/dashboard/notifications/read-all', requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
      await storage.markAllNotificationsAsRead(userId);
      res.status(200).json({ message: 'All notifications marked as read' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to mark notifications as read' });
    }
  });

  // =================== ADMIN ROUTES ===================
  // Middleware to require admin role
  function requireAdmin(req: Request, res: Response, next: NextFunction) {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: "Access denied: Admin rights required" });
    }
    
    next();
  }

  // Get all clients (users with role 'client')
  app.get('/api/admin/clients', requireAdmin, async (req: Request, res: Response) => {
    try {
      const clients = await storage.getUsersByRole('client');
      res.json(clients);
    } catch (error) {
      console.error('Error fetching clients:', error);
      res.status(500).json({ error: 'Failed to fetch clients' });
    }
  });
  
  // Create a new client account
  app.post('/api/admin/clients', requireAdmin, async (req: Request, res: Response) => {
    try {
      const { username, email, name, password } = req.body;
      
      // Check if username already exists
      const existingUsername = await storage.getUserByUsername(username);
      if (existingUsername) {
        return res.status(400).json({ error: 'Username already exists' });
      }
      
      // Check if email already exists
      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      
      // Create client user
      const newClient = await storage.createUser({
        username,
        email,
        name,
        password, // Password will be hashed in auth.ts
        role: 'client',
        avatarUrl: null
      });
      
      // Remove password from response
      const { password: _, ...clientWithoutPassword } = newClient;
      
      res.status(201).json(clientWithoutPassword);
    } catch (error) {
      console.error('Error creating client:', error);
      res.status(500).json({ error: 'Failed to create client' });
    }
  });
  
  // Get a specific client
  app.get('/api/admin/clients/:id', requireAdmin, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: 'Client not found' });
      }
      
      if (user.role !== 'client') {
        return res.status(400).json({ error: 'User is not a client' });
      }
      
      // Don't expose password to frontend
      const { password: _, ...userWithoutPassword } = user;
      
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Error fetching client:', error);
      res.status(500).json({ error: 'Failed to fetch client' });
    }
  });
  
  // Update a client
  app.put('/api/admin/clients/:id', requireAdmin, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const { username, email, name } = req.body;
      
      // Verify user exists and is a client
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: 'Client not found' });
      }
      
      if (user.role !== 'client') {
        return res.status(400).json({ error: 'User is not a client' });
      }
      
      // Check if new username already exists (if changing username)
      if (username && username !== user.username) {
        const existingUsername = await storage.getUserByUsername(username);
        if (existingUsername && existingUsername.id !== userId) {
          return res.status(400).json({ error: 'Username already exists' });
        }
      }
      
      // Check if new email already exists (if changing email)
      if (email && email !== user.email) {
        const existingEmail = await storage.getUserByEmail(email);
        if (existingEmail && existingEmail.id !== userId) {
          return res.status(400).json({ error: 'Email already exists' });
        }
      }
      
      // Update user
      const updatedUser = await storage.updateUser(userId, {
        username,
        email,
        name
      });
      
      if (!updatedUser) {
        return res.status(500).json({ error: 'Failed to update client' });
      }
      
      // Don't expose password to frontend
      const { password: _, ...userWithoutPassword } = updatedUser;
      
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Error updating client:', error);
      res.status(500).json({ error: 'Failed to update client' });
    }
  });
  
  // Reset client password
  app.post('/api/admin/clients/:id/reset-password', requireAdmin, async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const { newPassword } = req.body;
      
      if (!newPassword || newPassword.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }
      
      // Verify user exists and is a client
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: 'Client not found' });
      }
      
      if (user.role !== 'client') {
        return res.status(400).json({ error: 'User is not a client' });
      }
      
      // Update user password (hashing will be done in auth.ts)
      const updatedUser = await storage.updateUserPassword(userId, newPassword);
      
      if (!updatedUser) {
        return res.status(500).json({ error: 'Failed to reset password' });
      }
      
      res.json({ message: 'Password reset successfully' });
    } catch (error) {
      console.error('Error resetting client password:', error);
      res.status(500).json({ error: 'Failed to reset password' });
    }
  });

  // Get all projects (across all clients)
  app.get('/api/admin/projects', requireAdmin, async (req: Request, res: Response) => {
    try {
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error) {
      console.error('Error fetching all projects:', error);
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  });

  // Get all contact form submissions
  app.get('/api/admin/contacts', requireAdmin, async (req: Request, res: Response) => {
    try {
      const contacts = await storage.getContacts();
      res.json(contacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      res.status(500).json({ error: 'Failed to fetch contacts' });
    }
  });

  // Mark contact form as read
  app.post('/api/admin/contacts/:id/read', requireAdmin, async (req: Request, res: Response) => {
    try {
      const contactId = parseInt(req.params.id);
      const updatedContact = await storage.markContactAsRead(contactId);
      if (!updatedContact) {
        return res.status(404).json({ error: 'Contact not found' });
      }
      res.json(updatedContact);
    } catch (error) {
      console.error('Error marking contact as read:', error);
      res.status(500).json({ error: 'Failed to update contact' });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
