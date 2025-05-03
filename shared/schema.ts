import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false),
  fullName: text("full_name"),
  email: text("email"),
  cpf: text("cpf"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  phoneNumber: text("phone_number"),
  gameInterests: text("game_interests").array(),
  bio: text("bio"),
  preferredGame: text("preferred_game"),
  favoriteTeam: text("favorite_team"),
  notifications: boolean("notifications").default(true),
  newsletter: boolean("newsletter").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  lastLogin: timestamp("last_login"),
});

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  documentType: text("document_type").notNull(),
  documentPath: text("document_path").notNull(),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  image: text("image").notNull(),
  category: text("category").notNull(),
  description: text("description"),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  image: text("image").notNull(),
  description: text("description"),
  category: text("category"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const news = pgTable("news", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  content: text("content").notNull(),
  image: text("image").notNull(),
  date: timestamp("date").defaultNow(),
  category: text("category"),
  featured: boolean("featured").default(false),
});

export const streamers = pgTable("streamers", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  title: text("title"),
  thumbnail: text("thumbnail").notNull(),
  viewers: integer("viewers").default(0),
  isLive: boolean("is_live").default(false),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const team = pgTable("team", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  image: text("image").notNull(),
  bio: text("bio"),
  socialMedia: jsonb("social_media"),
  game: text("game"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const updateUserSchema = createInsertSchema(users).omit({
  id: true,
  password: true,
  createdAt: true,
  lastLogin: true,
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  verified: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type User = typeof users.$inferSelect;
export type Document = typeof documents.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Event = typeof events.$inferSelect;
export type News = typeof news.$inferSelect;
export type Streamer = typeof streamers.$inferSelect;
export type TeamMember = typeof team.$inferSelect;
