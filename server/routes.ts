import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { insertUserSchema, updateUserSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes and middleware
  setupAuth(app);

  // API Routes
  // User routes
  app.get("/api/users/profile", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove password before sending
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  app.patch("/api/users/profile", async (req: Request, res: Response) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const result = updateUserSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid data", errors: result.error.format() });
      }

      const updatedUser = await storage.updateUser(req.session.userId, result.data);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Remove password before sending
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Products endpoints
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      console.error("Get products error:", error);
      res.status(500).json({ message: "Failed to get products" });
    }
  });

  app.get("/api/products/personalized", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const products = await storage.getPersonalizedProducts(user);
      res.json(products);
    } catch (error) {
      console.error("Get personalized products error:", error);
      res.status(500).json({ message: "Failed to get personalized products" });
    }
  });

  // Events endpoints
  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getEvents();
      res.json(events);
    } catch (error) {
      console.error("Get events error:", error);
      res.status(500).json({ message: "Failed to get events" });
    }
  });

  app.get("/api/events/personalized", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const events = await storage.getPersonalizedEvents(user);
      res.json(events);
    } catch (error) {
      console.error("Get personalized events error:", error);
      res.status(500).json({ message: "Failed to get personalized events" });
    }
  });

  // News endpoints
  app.get("/api/news", async (req, res) => {
    try {
      const news = await storage.getNews();
      res.json(news);
    } catch (error) {
      console.error("Get news error:", error);
      res.status(500).json({ message: "Failed to get news" });
    }
  });

  app.get("/api/news/personalized", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const news = await storage.getPersonalizedNews(user);
      res.json(news);
    } catch (error) {
      console.error("Get personalized news error:", error);
      res.status(500).json({ message: "Failed to get personalized news" });
    }
  });

  // Team members endpoint
  app.get("/api/team", async (req, res) => {
    try {
      const team = await storage.getTeam();
      res.json(team);
    } catch (error) {
      console.error("Get team error:", error);
      res.status(500).json({ message: "Failed to get team" });
    }
  });

  // Streamers endpoint
  app.get("/api/streamers/live", async (req, res) => {
    try {
      const streamers = await storage.getLiveStreamers();
      res.json(streamers);
    } catch (error) {
      console.error("Get live streamers error:", error);
      res.status(500).json({ message: "Failed to get live streamers" });
    }
  });

  // Document upload endpoint
  app.post("/api/documents/upload", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      // In a real implementation, this would handle file upload
      // For this demo, we're just saving a reference
      const document = await storage.saveDocument({
        userId: req.session.userId,
        documentType: req.body.documentType,
        documentPath: req.body.documentPath,
      });

      res.json(document);
    } catch (error) {
      console.error("Document upload error:", error);
      res.status(500).json({ message: "Failed to upload document" });
    }
  });

  // Admin routes
  app.get("/api/admin/users", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const user = await storage.getUser(req.session.userId);
      if (!user || !user.isAdmin) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const users = await storage.getAllUsers();
      // Remove passwords before sending
      const usersWithoutPasswords = users.map(({ password, ...user }) => user);
      res.json(usersWithoutPasswords);
    } catch (error) {
      console.error("Get all users error:", error);
      res.status(500).json({ message: "Failed to get users" });
    }
  });

  app.get("/api/admin/users/stats", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const user = await storage.getUser(req.session.userId);
      if (!user || !user.isAdmin) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const timeframe = req.query.timeframe as string || "all";
      const stats = await storage.getUserStats(timeframe);
      res.json(stats);
    } catch (error) {
      console.error("Get user stats error:", error);
      res.status(500).json({ message: "Failed to get user stats" });
    }
  });

  app.get("/api/admin/users/interests", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const user = await storage.getUser(req.session.userId);
      if (!user || !user.isAdmin) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const timeframe = req.query.timeframe as string || "all";
      const interests = await storage.getUsersByInterest(timeframe);
      res.json(interests);
    } catch (error) {
      console.error("Get users by interest error:", error);
      res.status(500).json({ message: "Failed to get users by interest" });
    }
  });

  app.get("/api/admin/users/locations", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const user = await storage.getUser(req.session.userId);
      if (!user || !user.isAdmin) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const timeframe = req.query.timeframe as string || "all";
      const locations = await storage.getUsersByLocation(timeframe);
      res.json(locations);
    } catch (error) {
      console.error("Get users by location error:", error);
      res.status(500).json({ message: "Failed to get users by location" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
