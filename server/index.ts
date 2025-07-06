import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { performanceMonitor } from "./performance-monitor";
import { createServer } from "http";
import net from "net";

// Set SendGrid API key
// SendGrid API key should be set via environment variables

// Function to find an available port
function findAvailablePort(startPort: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(startPort, '0.0.0.0', () => {
      const port = (server.address() as net.AddressInfo)?.port;
      server.close(() => resolve(port));
    });
    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        findAvailablePort(startPort + 1).then(resolve).catch(reject);
      } else {
        reject(err);
      }
    });
  });
}

const app = express();

// Add session support for authentication
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple in-memory session store for authentication
const sessions = new Map<string, any>();

// Session middleware
app.use((req: any, res, next) => {
  const sessionId = req.headers['x-session-id'] || 'default';
  req.session = sessions.get(sessionId) || {};
  
  // Save session after response
  const originalSend = res.send;
  res.send = function(data: any) {
    sessions.set(sessionId, req.session);
    return originalSend.call(this, data);
  };
  
  next();
});

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

(async () => {
  const server = await registerRoutes(app);

  // Start the Adaptive Performance Optimizer
  try {
    await performanceMonitor.start();
    log("Adaptive Performance Optimizer started successfully");
  } catch (error) {
    console.error("Failed to start Performance Monitor:", error);
  }

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

  // Find available port starting from 5000
  const port = await findAvailablePort(5000);
  server.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port}`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    performanceMonitor.stop();
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });
})();
