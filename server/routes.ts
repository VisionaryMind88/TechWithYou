import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
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

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
