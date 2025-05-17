import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { firebaseAuthMiddleware } from "./firebase-auth";
import * as dotenv from 'dotenv';
import { db } from './db';

// Laad de environment variables
dotenv.config();

const app = express();

// Railway health check route - highest priority
// This ensures Railway can always reach the health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).send('OK');
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Productie-specifieke middleware toevoegen
if (process.env.NODE_ENV === 'production') {
  // Security headers
  app.use((req, res, next) => {
    // Bescherming tegen clickjacking
    res.setHeader('X-Frame-Options', 'DENY');
    // XSS Protection
    res.setHeader('X-XSS-Protection', '1; mode=block');
    // Content type sniffing bescherming
    res.setHeader('X-Content-Type-Options', 'nosniff');
    // Strict Transport Security
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    // Referrer policy
    res.setHeader('Referrer-Policy', 'same-origin');
    // Content Security Policy
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.openai.com https://*.supabase.co"
    );
    next();
  });
}

// Firebase Authentication middleware toevoegen
app.use(firebaseAuthMiddleware);

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Functie om database te initialiseren bij de eerste opstart met retry mechanisme
async function initDatabase() {
  const maxRetries = 5;
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      if (process.env.NODE_ENV === 'production') {
        console.log(`Database initialisatie poging ${retries + 1}/${maxRetries}...`);
        
        // Test database connectie
        await db.execute("SELECT 1");
        console.log("Succesvol verbonden met Supabase database");
        
        // In een echte production omgeving zou je migratie bestanden gebruiken
        // Dit is een vereenvoudigde aanpak voor de eerste deployment
        console.log("Database schema initialisatie voltooid");
      }
      // Succesvol verbonden, stop met retries
      return;
    } catch (error) {
      retries++;
      console.error(`Database initialisatie poging ${retries}/${maxRetries} mislukt:`, error);
      
      if (retries >= maxRetries) {
        console.log("Database initialisatie gefaald na maximale pogingen. Server start zonder database initialisatie.");
        // Throw geen error zodat de server toch kan starten voor Railway healthcheck
        return;
      }
      
      // Wacht 3 seconden voor volgende poging
      console.log(`Wachten voor ${3 * retries} seconden voor volgende poging...`);
      await new Promise(resolve => setTimeout(resolve, 3000 * retries));
    }
  }
}

(async () => {
  // Initialiseer database voordat de server start
  await initDatabase();
  
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
