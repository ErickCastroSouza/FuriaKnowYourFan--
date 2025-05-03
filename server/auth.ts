import express, { type Express } from "express";
import session from "express-session";
import MemoryStore from "memorystore";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { storage } from "./storage";
import { insertUserSchema } from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "./db";


// Create MemoryStore for sessions
const SessionStore = MemoryStore(session);

export function setupAuth(app: Express): void {
  // Configure passport with local strategy
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        
        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }
        
        if (user.password !== password) {
          return done(null, false, { message: "Incorrect password." });
        }
        
        // Update last login time
        await storage.updateUser(user.id, { lastLogin: new Date() });
        
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );

  // Serialize user to session
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Initialize session middleware
  app.use(
    session({
      cookie: {
        maxAge: 86400000, // 1 day
        secure: false,
      },
      secret: process.env.SESSION_SECRET || "furia-secret-key",
      resave: false,
      saveUninitialized: false,
      store: new SessionStore({
        checkPeriod: 86400000, // 1 day
      }),
    })
  );

  // Initialize passport middleware
  app.use(passport.initialize());
  app.use(passport.session());

  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    const { username, password: inputPassword } = req.body;
    
  
    const user = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.username, username),
    });
  
    if (!user) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }
  
    if (user.password !== inputPassword) {
      return res.status(401).json({ error: "Senha incorreta" });
    }
    // Remove o hash antes de enviar pro frontend
    const { password, ...userData } = user;
    return res.status(200).json(userData);
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const result = insertUserSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid data", 
          errors: result.error.format() 
        });
      }
      
      const { username, password } = result.data;
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Create user
      const user = await storage.createUser({ username, password });
      
      // Log in the user automatically
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Error logging in after registration" });
        }
        
        // Store user ID in session
        req.session.userId = user.id;
        
        // Return user info without password
        const { password, ...userWithoutPassword } = user;
        return res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Failed to register user" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout(() => {
      req.session.destroy(() => {
        res.clearCookie("connect.sid");
        res.status(200).json({ message: "Logged out successfully" });
      });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    if (!req.isAuthenticated() || !req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    const user = req.user as any;
    
    // Return user info without password
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });
}
