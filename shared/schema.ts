import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const contactMessageSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Por favor ingresa un email válido"),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
});

export type ContactMessage = z.infer<typeof contactMessageSchema>;

export const contactMessages = pgTable("contact_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  subscribedAt: timestamp("subscribed_at").default(sql`now()`),
});

export const insertNewsletterSchema = z.object({
  email: z.string().email("Por favor ingresa un email válido"),
});

export type InsertNewsletter = z.infer<typeof insertNewsletterSchema>;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;

export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  image: text("image"),
  author: text("author").default("EcoRed Comunal"),
  published: boolean("published").default(false),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

export const insertBlogSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertBlog = z.infer<typeof insertBlogSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

export const recyclingStats = pgTable("recycling_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  communityName: text("community_name").notNull().unique(),
  materialsRecycled: integer("materials_recycled").default(0),
  householdsParticipating: integer("households_participating").default(0),
  co2Reduced: integer("co2_reduced").default(0),
  greenJobsCreated: integer("green_jobs_created").default(0),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

export const insertRecyclingStatsSchema = createInsertSchema(recyclingStats).omit({
  id: true,
  updatedAt: true,
});

export type InsertRecyclingStats = z.infer<typeof insertRecyclingStatsSchema>;
export type RecyclingStats = typeof recyclingStats.$inferSelect;

export const ecotramaUsers = pgTable("ecotrama_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  points: integer("points").default(0),
  level: integer("level").default(1),
  rank: text("rank").default("EcoAliado"),
  league: text("league").default("Local"),
  carbonSaved: integer("carbon_saved").default(0),
  householdAddress: text("household_address"),
  totalScans: integer("total_scans").default(0),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

export const insertEcotramaUserSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  name: z.string().min(2, "Nombre requerido"),
  householdAddress: z.string().optional(),
});

export type InsertEcotramaUser = z.infer<typeof insertEcotramaUserSchema>;
export type EcotramaUser = typeof ecotramaUsers.$inferSelect;

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  barcode: text("barcode").notNull().unique(),
  name: text("name").notNull(),
  brand: text("brand"),
  type: text("type").notNull(), // Plastic, Glass, Metal, etc.
  points: integer("points").notNull().default(10),
  description: text("description"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export const scans = pgTable("scans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  wasteType: text("waste_type").notNull(),
  quantity: integer("quantity").default(1),
  pointsEarned: integer("points_earned").notNull(),
  scannedAt: timestamp("scanned_at").default(sql`now()`),
});

export type Scan = typeof scans.$inferSelect;
