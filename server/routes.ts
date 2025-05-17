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
import { db } from "./db";

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
  
  // Health check endpoint voor Railway deployment
  app.get('/api/health', (req: Request, res: Response) => {
    // Basic health check that doesn't depend on any other services
    // Returns immediately for Railway's health check system
    return res.status(200).send('OK');
  });
  
  // Detailed health check endpoint for monitoring
  app.get('/api/health/detailed', async (req: Request, res: Response) => {
    try {
      // Database connectie testen
      await db.execute('SELECT 1');
      return res.status(200).json({ status: 'healthy', message: 'Application is running and database connection is active' });
    } catch (error) {
      console.error('Health check failed:', error);
      return res.status(500).json({ status: 'unhealthy', message: 'Database connection failed' });
    }
  });
  
  // API endpoints for checking username and email existence (for registration validation)
  app.get('/api/check-username', async (req: Request, res: Response) => {
    try {
      const { username } = req.query;
      
      if (!username || typeof username !== 'string') {
        return res.status(400).json({ message: "Username parameter is required" });
      }
      
      const existingUser = await storage.getUserByUsername(username);
      
      if (existingUser) {
        // Username exists, return conflict status
        return res.status(409).json({ message: "Username already exists" });
      }
      
      // Username doesn't exist, return success
      return res.status(200).json({ message: "Username is available" });
    } catch (error) {
      console.error("Error checking username:", error);
      return res.status(500).json({ message: "Error checking username availability" });
    }
  });
  
  app.get('/api/check-email', async (req: Request, res: Response) => {
    try {
      const { email } = req.query;
      
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ message: "Email parameter is required" });
      }
      
      const existingUser = await storage.getUserByEmail(email);
      
      if (existingUser) {
        // Email exists, return conflict status
        return res.status(409).json({ message: "Email already exists" });
      }
      
      // Email doesn't exist, return success
      return res.status(200).json({ message: "Email is available" });
    } catch (error) {
      console.error("Error checking email:", error);
      return res.status(500).json({ message: "Error checking email availability" });
    }
  });
  
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
      
      // Send email to info@techwithyou.nl
      await emailService.sendContactFormEmail(
        contactData.name,
        contactData.email,
        contactData.company,
        contactData.service,
        contactData.message
      );
      
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
      console.error('Contact form error:', error);
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
      console.log(`GET /api/dashboard/projects: Fetching projects for user ${user.username} (ID: ${userId})`);
      
      const projects = await storage.getUserProjects(userId);
      console.log(`GET /api/dashboard/projects: Found ${projects.length} projects for user ${userId}`);
      
      // Log de IDs en namen van de gevonden projecten
      if (projects.length > 0) {
        console.log('Projects found:', projects.map(p => ({ id: p.id, name: p.name, status: p.status })));
      } else {
        console.log('No projects found for this user');
      }
      
      res.json(projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({ message: 'Failed to fetch projects' });
    }
  });
  
  app.post('/api/dashboard/projects', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = assertUser(req, res);
      if (!user) return;
      
      console.log(`Creating project for user ${user.username} (ID: ${user.id})`);
      console.log('Project data received:', JSON.stringify(req.body, null, 2));
      
      const userId = user.id;
      
      try {
        // Belangrijk: zorg ervoor dat de userId een number is
        const rawData = {
          ...req.body,
          userId: Number(userId)
        };
        
        console.log('Project data before validation:', JSON.stringify(rawData, null, 2));
        
        // Valideer de data met schema
        const projectData = insertProjectSchema.parse(rawData);
        
        console.log('Project data after validation:', JSON.stringify(projectData, null, 2));
        
        // Controleer kritieke velden
        if (!projectData.name || !projectData.description || !projectData.type) {
          console.error('Missing required fields in project data');
          return res.status(400).json({
            message: 'Invalid project data',
            errors: ['Required fields (name, description, type) are missing']
          });
        }
        
        // Gebruik zeker status 'proposal' indien niet meegegeven
        if (!projectData.status) {
          projectData.status = 'proposal';
        }
        
        const project = await storage.createProject(projectData);
        console.log('Project created successfully:', JSON.stringify(project, null, 2));
        
        // Maak een notificatie over het nieuwe project
        try {
          await storage.createNotification({
            userId,
            title: 'New Project Created',
            message: `Your project '${project.name}' has been created successfully.`,
            type: 'success'
          });
          console.log('Notification created for project');
        } catch (notificationError) {
          // Log maar laat het project doorgaan zelfs als de notificatie mislukt
          console.error('Failed to create notification, but project was created:', notificationError);
        }
        
        res.status(201).json(project);
      } catch (validationError: any) {
        console.error('Project validation error:', validationError);
        
        if (validationError.name === 'ZodError') {
          const formattedError = fromZodError(validationError);
          return res.status(400).json({
            message: 'Invalid project data',
            errors: formattedError.details
          });
        }
        
        throw validationError; // Rethrow if not a validation error
      }
    } catch (error: any) {
      console.error('Project creation failed:', error);
      res.status(500).json({ message: 'Failed to create project: ' + (error.message || 'Unknown error') });
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

  // Bestand uploaden naar project
  app.post('/api/dashboard/projects/:projectId/files', requireAuth, async (req: Request, res: Response) => {
    try {
      const user = assertUser(req, res);
      if (!user) return;
      
      const projectId = parseInt(req.params.projectId);
      
      // Validatie: Controleer of het project bestaat en of deze gebruiker toegang heeft
      const project = await storage.getProject(projectId);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      
      // Alleen toegang voor eigenaar of admin
      if (project.userId !== user.id && user.role !== 'admin') {
        return res.status(403).json({ error: 'You do not have permission to access this project' });
      }
      
      // Verwerk bestandsinformatie van de client
      const { name, description, fileUrl, fileType, fileSize, notifyAdmin } = req.body;
      
      // Validatie
      if (!name) {
        return res.status(400).json({ error: 'File name is required' });
      }
      
      if (!fileUrl) {
        return res.status(400).json({ error: 'File URL is required' });
      }
      
      // Maak een nieuw projectbestand aan met de echte URL
      const newFile = await storage.createProjectFile({
        projectId,
        name,
        description: description || '',
        fileUrl: fileUrl, // We gebruiken nu de echte URL van Firebase Storage
        fileType: fileType || 'application/octet-stream', // Gebruik het echte bestandstype
        fileSize: parseInt(fileSize) || 0, // Gebruik de echte bestandsgrootte
        uploadedBy: user.id,
        createdAt: new Date(),
      });
      
      // Als notifyAdmin is ingeschakeld, stuur een notificatie naar alle admins
      if (notifyAdmin === 'true') {
        console.log('Sending notification to admins about new file upload');
        
        // Haal alle admins op
        const admins = await storage.getUsersByRole('admin');
        
        // Stuur een notificatie naar elke admin
        for (const admin of admins) {
          await storage.createNotification({
            userId: admin.id,
            title: 'New File Uploaded',
            message: `${user.name || user.username} has uploaded a new file "${name}" to project "${project.name}"`,
            type: 'file_upload',
            read: false,
            link: `/admin/projects/${projectId}`,
            createdAt: new Date(),
          });
        }
      }
      
      res.status(201).json(newFile);
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ error: 'Failed to upload file' });
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
      console.log(`GET /api/admin/projects: Admin (${req.user.username}) fetching all projects`);
      
      const projects = await storage.getAllProjects();
      
      console.log(`GET /api/admin/projects: Found ${projects.length} projects total in system`);
      
      // Log de IDs en namen van de gevonden projecten
      if (projects.length > 0) {
        console.log('Projects found:', projects.map(p => ({ 
          id: p.id, 
          name: p.name, 
          status: p.status,
          userId: p.userId
        })));
      } else {
        console.log('No projects found in the system');
      }
      
      res.json(projects);
    } catch (error) {
      console.error('Error fetching all projects:', error);
      res.status(500).json({ error: 'Failed to fetch projects' });
    }
  });
  
  // Update a project (admin access)
  app.put('/api/admin/projects/:id', requireAdmin, async (req: Request, res: Response) => {
    try {
      const admin = req.user;
      const projectId = parseInt(req.params.id, 10);
      
      console.log(`PUT /api/admin/projects/${projectId}: Admin ${admin?.username} updating project`);
      console.log('Update data:', JSON.stringify(req.body, null, 2));
      
      const project = await storage.getProject(projectId);
      
      if (!project) {
        console.log(`Project with ID ${projectId} not found`);
        return res.status(404).json({ error: 'Project not found' });
      }
      
      console.log(`Found project: "${project.name}" (ID: ${project.id}) with current status: ${project.status}`);
      
      // Update project
      const updatedProject = await storage.updateProject(projectId, req.body);
      
      console.log(`Project updated successfully, new status: ${req.body.status || project.status}`);
      
      // Als status is approved, stuur een speciale bericht
      if (req.body.status === 'approved' && req.body.status !== project.status) {
        console.log(`Creating 'project approved' notification for user ${project.userId}`);
        
        await storage.createNotification({
          userId: project.userId,
          title: 'Project Approved!',
          message: `Good news! Your project '${project.name}' has been approved and will move forward.`,
          type: 'success',
          link: `/dashboard/projects/${project.id}`
        });
      }
      // Als status is planning (oude versie van approval), stuur approval bericht
      else if (req.body.status === 'planning' && project.status === 'pending') {
        console.log(`Creating 'project approved (planning)' notification for user ${project.userId}`);
        
        await storage.createNotification({
          userId: project.userId,
          title: 'Project Approved',
          message: `Your project '${project.name}' has been approved and moved to planning phase.`,
          type: 'success',
          link: `/dashboard/projects/${project.id}`
        });
      }
      // Als status is rejected, stuur een speciale bericht
      else if (req.body.status === 'rejected' && req.body.status !== project.status) {
        console.log(`Creating 'project rejected' notification for user ${project.userId}`);
        
        await storage.createNotification({
          userId: project.userId,
          title: 'Project Requires Changes',
          message: `Your project '${project.name}' needs some adjustments before we can proceed.`,
          type: 'warning',
          link: `/dashboard/projects/${project.id}`
        });
      }
      // Voor andere statuswijzigingen
      else if (req.body.status && req.body.status !== project.status) {
        console.log(`Creating status update notification for user ${project.userId}`);
        
        await storage.createNotification({
          userId: project.userId,
          title: 'Project Status Updated',
          message: `Your project '${project.name}' status has been updated to '${req.body.status}'.`,
          type: 'info',
          link: `/dashboard/projects/${project.id}`
        });
      }
      
      res.json(updatedProject);
    } catch (error) {
      console.error('Error updating project:', error);
      res.status(500).json({ error: 'Failed to update project' });
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
