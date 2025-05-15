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
import { setupAuth } from "./auth";

// Middleware to check if user is authenticated
function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);
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
    } catch (error) {
      // Handle validation errors
      if (error.name === 'ZodError') {
        const validationError = fromZodError(error);
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
      const userId = req.user.id;
      const projects = await storage.getUserProjects(userId);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch projects' });
    }
  });
  
  app.post('/api/dashboard/projects', requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = req.user.id;
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
    } catch (error) {
      if (error.name === 'ZodError') {
        const validationError = fromZodError(error);
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
      const projectId = parseInt(req.params.id, 10);
      const project = await storage.getProject(projectId);
      
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      
      // Ensure user owns this project
      if (project.userId !== req.user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch project' });
    }
  });
  
  app.put('/api/dashboard/projects/:id', requireAuth, async (req: Request, res: Response) => {
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
    } catch (error) {
      if (error.name === 'ZodError') {
        const validationError = fromZodError(error);
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

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
