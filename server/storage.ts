import {
  type User,
  type InsertUser,
  type ContactMessage,
  type InsertNewsletter,
  type NewsletterSubscriber,
  type InsertBlog,
  type BlogPost,
  type InsertRecyclingStats,
  type RecyclingStats,
  type EcotramaUser,
  type InsertEcotramaUser,
  type Scan
} from "@shared/schema";
import { randomUUID } from "crypto";
import session from "express-session";
import createMemoryStore from "memorystore";
import connectPg from "connect-pg-simple";
import { pool, db as drizzleDb } from "./db";
import { eq, desc } from "drizzle-orm";
import {
  users, contactMessages, newsletterSubscribers, blogPosts,
  recyclingStats, ecotramaUsers, scans
} from "@shared/schema";

const MemoryStore = createMemoryStore(session);
const PostgresStore = connectPg(session);

export interface StoredContactMessage extends ContactMessage {
  id: string;
  createdAt: Date | null;
}

export interface IStorage {
  sessionStore: session.Store;
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createContactMessage(message: ContactMessage): Promise<StoredContactMessage>;
  getContactMessages(): Promise<StoredContactMessage[]>;
  subscribeNewsletter(data: InsertNewsletter): Promise<NewsletterSubscriber>;
  getNewsletterSubscribers(): Promise<NewsletterSubscriber[]>;
  createBlogPost(post: InsertBlog): Promise<BlogPost>;
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getRecyclingStats(): Promise<RecyclingStats[]>;
  updateRecyclingStats(communityName: string, stats: Partial<RecyclingStats>): Promise<RecyclingStats>;
  createEcotramaUser(user: InsertEcotramaUser): Promise<EcotramaUser>;
  getEcotramaUserByEmail(email: string): Promise<EcotramaUser | undefined>;
  getEcotramaUser(id: string): Promise<EcotramaUser | undefined>;
  recordScan(userId: string, wasteType: string, quantity: number): Promise<{ pointsEarned: number; newPoints: number }>;
  getLeaderboard(): Promise<EcotramaUser[]>;
  addPoints(userId: string, points: number): Promise<EcotramaUser>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private contactMessages: Map<string, StoredContactMessage>;
  private newsletterSubscribers: Map<string, NewsletterSubscriber>;
  private blogPosts: Map<string, BlogPost>;
  private recyclingStats: Map<string, RecyclingStats>;
  private ecotramaUsers: Map<string, EcotramaUser>;
  private scans: Map<string, Scan>;
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
    this.users = new Map();
    this.contactMessages = new Map();
    this.newsletterSubscribers = new Map();
    this.blogPosts = new Map();
    this.recyclingStats = new Map();
    this.ecotramaUsers = new Map();
    this.scans = new Map();
    this.initializeSampleData();
  }

  private calculateRank(points: number): string {
    if (points >= 5000) return "EcoGold";
    if (points >= 3000) return "EcoAgente";
    if (points >= 1500) return "EcoLider";
    if (points >= 500) return "EcoAmigo";
    return "EcoAliado";
  }

  private calculateLeague(points: number): string {
    if (points >= 10000) return "Internacional";
    if (points >= 5000) return "Nacional";
    if (points >= 2000) return "Regional";
    return "Local";
  }

  private initializeSampleData() {
    // Initialize default recycling stats for communities
    const communities = ["Barrio Cuba", "Comuna San Joaquín", "Zona Centro"];
    communities.forEach((community) => {
      const stats: RecyclingStats = {
        id: randomUUID(),
        communityName: community,
        materialsRecycled: Math.floor(Math.random() * 5000) + 1000,
        householdsParticipating: Math.floor(Math.random() * 200) + 50,
        co2Reduced: Math.floor(Math.random() * 50) + 10,
        greenJobsCreated: Math.floor(Math.random() * 15) + 3,
        updatedAt: new Date(),
      };
      this.recyclingStats.set(community, stats);
    });

    // Initialize sample blog posts
    const samplePosts: BlogPost[] = [
      {
        id: randomUUID(),
        title: "¿Por qué es importante la economía circular?",
        slug: "por-que-economia-circular",
        excerpt: "Descubre cómo la economía circular transforma nuestras comunidades y protege el medio ambiente.",
        content: "La economía circular es un modelo sostenible que busca minimizar los residuos...",
        category: "Educación",
        author: "EcoRed Comunal",
        published: true,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=500&h=300&fit=crop",
      },
      {
        id: randomUUID(),
        title: "Cómo separar correctamente tus residuos",
        slug: "separar-residuos-correctamente",
        excerpt: "Guía práctica para separar residuos en la fuente y maximizar el reciclaje.",
        content: "La separación de residuos en la fuente es fundamental para un reciclaje efectivo. Aquí te presentamos los pasos clave:\n\n1. PAPEL Y CARTÓN:\n- Periódicos, revistas, cajas de cartón\n- Bolsas de papel limpias\n- Separa de residuos húmedos\n\n2. PLÁSTICO:\n- Botellas y envases de plástico\n- Bolsas plásticas limpias\n- Evita mezclar con residuos orgánicos\n\n3. VIDRIO:\n- Botellas y frascos de vidrio\n- Separa el vidrio de otros materiales\n- Ten cuidado con los bordes cortantes\n\n4. METALES:\n- Latas de aluminio y acero\n- Metales varios y herrajes\n- Procura que estén limpios\n\n5. RESIDUOS ORGÁNICOS:\n- Restos de comida y cocina\n- Hojas y jardín\n- Deposita en contenedor específico\n\n6. RESIDUOS ESPECIALES:\n- Bombillas y electrodomésticos\n- Pilas y baterías\n- Medicamentos (entregar en farmacias)\n\nCONSEJOS IMPORTANTES:\n✓ Limpia los envases antes de separarlos\n✓ Desactiva las botellas plásticas\n✓ Seca los materiales húmedos\n✓ Usa bolsas claras para visibilidad\n✓ Mantén los contenedores organizados\n\nAl separar correctamente, contribuyes a:\n- Reducir la contaminación\n- Ahorrar energía\n- Crear empleo verde\n- Fortalecer tu comunidad\n\n¡Recuerda! Una clasificación correcta en casa facilita el trabajo de los recicladores y maximiza el aprovechamiento de los materiales.",
        category: "Tutorial",
        author: "EcoRed Comunal",
        published: true,
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        image: "/images/family_recycling_v2.jpg",
      },
      {
        id: randomUUID(),
        title: "Historias de éxito: Comunidades transformadas",
        slug: "historias-exito-comunidades",
        excerpt: "Conoce cómo EcoRed ha transformado comunidades en toda Colombia.",
        content: "Estas son las historias inspiradoras de nuestras comunidades...",
        category: "Historias",
        author: "EcoRed Comunal",
        published: true,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop",
      },
    ];

    samplePosts.forEach((post) => {
      this.blogPosts.set(post.id, post);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createContactMessage(message: ContactMessage): Promise<StoredContactMessage> {
    const id = randomUUID();
    const storedMessage: StoredContactMessage = {
      ...message,
      id,
      createdAt: new Date(),
    };
    this.contactMessages.set(id, storedMessage);
    return storedMessage;
  }

  async getContactMessages(): Promise<StoredContactMessage[]> {
    return Array.from(this.contactMessages.values()).sort(
      (a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }

  async subscribeNewsletter(data: InsertNewsletter): Promise<NewsletterSubscriber> {
    const existing = Array.from(this.newsletterSubscribers.values()).find(
      (sub) => sub.email === data.email
    );
    if (existing) {
      return existing;
    }
    const subscriber: NewsletterSubscriber = {
      id: randomUUID(),
      email: data.email,
      subscribedAt: new Date(),
    };
    this.newsletterSubscribers.set(subscriber.id, subscriber);
    return subscriber;
  }

  async getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    return Array.from(this.newsletterSubscribers.values());
  }

  async createBlogPost(post: InsertBlog): Promise<BlogPost> {
    const now = new Date();
    const blogPost: BlogPost = {
      ...post,
      id: randomUUID(),
      createdAt: now,
      updatedAt: now,
      image: post.image || null,
      author: post.author || null,
      published: post.published || false,
    };
    this.blogPosts.set(blogPost.id, blogPost);
    return blogPost;
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .filter((post) => post.published)
      .sort((a, b) => {
        const timeA = (b.createdAt as Date).getTime();
        const timeB = (a.createdAt as Date).getTime();
        return timeA - timeB;
      });
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogPosts.values()).find((post) => post.slug === slug);
  }

  async getRecyclingStats(): Promise<RecyclingStats[]> {
    return Array.from(this.recyclingStats.values());
  }

  async updateRecyclingStats(communityName: string, stats: Partial<RecyclingStats>): Promise<RecyclingStats> {
    let community = Array.from(this.recyclingStats.values()).find(
      (s) => s.communityName === communityName
    );
    if (!community) {
      community = {
        id: randomUUID(),
        communityName,
        materialsRecycled: 0,
        householdsParticipating: 0,
        co2Reduced: 0,
        greenJobsCreated: 0,
        updatedAt: new Date(),
      };
    }
    const updated = { ...community, ...stats, updatedAt: new Date() };
    this.recyclingStats.set(community.id, updated);
    return updated;
  }

  async createEcotramaUser(user: InsertEcotramaUser): Promise<EcotramaUser> {
    const existing = await this.getEcotramaUserByEmail(user.email);
    if (existing) return existing;

    const newUser: EcotramaUser = {
      id: randomUUID(),
      email: user.email,
      password: user.password,
      name: user.name,
      points: 0,
      level: 1,
      rank: "EcoAliado",
      league: "Local",
      carbonSaved: 0,
      householdAddress: user.householdAddress || null,
      totalScans: 0,
      createdAt: new Date(),
    };
    this.ecotramaUsers.set(newUser.id, newUser);
    return newUser;
  }

  async getEcotramaUserByEmail(email: string): Promise<EcotramaUser | undefined> {
    return Array.from(this.ecotramaUsers.values()).find(u => u.email === email);
  }

  async getEcotramaUser(id: string): Promise<EcotramaUser | undefined> {
    return this.ecotramaUsers.get(id);
  }

  async recordScan(userId: string, wasteType: string, quantity: number): Promise<{ pointsEarned: number; newPoints: number }> {
    const user = Array.from(this.ecotramaUsers.values()).find(u => u.id === userId);
    if (!user) throw new Error("User not found");

    const pointsMap: Record<string, number> = {
      "Plástico": 10, "Vidrio": 15, "Metal": 20, "Papel": 5, "Orgánico": 8, "Electrónico": 50
    };
    const pointsEarned = (pointsMap[wasteType] || 10) * quantity;

    user.points = (user.points || 0) + pointsEarned;
    user.totalScans = (user.totalScans || 0) + 1;
    user.rank = this.calculateRank(user.points);
    user.league = this.calculateLeague(user.points);
    // Rough carbon calculation: 0.5kg saved per scan point (simplified)
    user.carbonSaved = Math.round(user.points * 0.5);

    const scan: Scan = {
      id: randomUUID(),
      userId,
      wasteType,
      quantity,
      pointsEarned,
      scannedAt: new Date(),
    };
    this.scans.set(scan.id, scan);

    return { pointsEarned, newPoints: user.points };
  }

  async getLeaderboard(): Promise<EcotramaUser[]> {
    return Array.from(this.ecotramaUsers.values())
      .sort((a, b) => (b.points || 0) - (a.points || 0))
      .slice(0, 10);
  }

  async addPoints(userId: string, points: number): Promise<EcotramaUser> {
    const user = this.ecotramaUsers.get(userId);
    if (!user) throw new Error("User not found");

    user.points = (user.points || 0) + points;
    user.rank = this.calculateRank(user.points);
    user.league = this.calculateLeague(user.points);

    return user;
  }
}

export class DatabaseStorage implements IStorage {
  db: NonNullable<typeof drizzleDb>;
  sessionStore: session.Store;

  constructor(db: NonNullable<typeof drizzleDb>) {
    this.db = db;
    this.sessionStore = new PostgresStore({
      pool: pool!, // We know pool exists if db exists
      createTableIfMissing: true,
    });
  }

  private calculateRank(points: number): string {
    if (points >= 5000) return "EcoGold";
    if (points >= 3000) return "EcoAgente";
    if (points >= 1500) return "EcoLider";
    if (points >= 500) return "EcoAmigo";
    return "EcoAliado";
  }

  private calculateLeague(points: number): string {
    if (points >= 10000) return "Internacional";
    if (points >= 5000) return "Nacional";
    if (points >= 2000) return "Regional";
    return "Local";
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await this.db.insert(users).values(insertUser).returning();
    return user;
  }

  async createContactMessage(message: ContactMessage): Promise<StoredContactMessage> {
    const [storedMessage] = await this.db
      .insert(contactMessages)
      .values(message)
      .returning();
    return storedMessage;
  }

  async getContactMessages(): Promise<StoredContactMessage[]> {
    return await this.db
      .select()
      .from(contactMessages)
      .orderBy(desc(contactMessages.createdAt));
  }

  async subscribeNewsletter(data: InsertNewsletter): Promise<NewsletterSubscriber> {
    // Try to find existing
    const [existing] = await this.db
      .select()
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, data.email));

    if (existing) return existing;

    const [subscriber] = await this.db
      .insert(newsletterSubscribers)
      .values(data)
      .returning();
    return subscriber;
  }

  async getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    return await this.db.select().from(newsletterSubscribers);
  }

  async createBlogPost(post: InsertBlog): Promise<BlogPost> {
    const [blogPost] = await this.db.insert(blogPosts).values(post).returning();
    return blogPost;
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    return await this.db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.published, true))
      .orderBy(desc(blogPosts.createdAt));
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await this.db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post;
  }

  async getRecyclingStats(): Promise<RecyclingStats[]> {
    return await this.db.select().from(recyclingStats);
  }

  async updateRecyclingStats(communityName: string, stats: Partial<RecyclingStats>): Promise<RecyclingStats> {
    const [existing] = await this.db
      .select()
      .from(recyclingStats)
      .where(eq(recyclingStats.communityName, communityName));

    if (existing) {
      const [updated] = await this.db
        .update(recyclingStats)
        .set({ ...stats, updatedAt: new Date() })
        .where(eq(recyclingStats.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await this.db
        .insert(recyclingStats)
        .values({
          communityName,
          materialsRecycled: stats.materialsRecycled || 0,
          householdsParticipating: stats.householdsParticipating || 0,
          co2Reduced: stats.co2Reduced || 0,
          greenJobsCreated: stats.greenJobsCreated || 0,
          updatedAt: new Date(),
        })
        .returning();
      return created;
    }
  }

  async createEcotramaUser(user: InsertEcotramaUser): Promise<EcotramaUser> {
    const [existing] = await this.db
      .select()
      .from(ecotramaUsers)
      .where(eq(ecotramaUsers.email, user.email));

    if (existing) return existing;

    const [newUser] = await this.db
      .insert(ecotramaUsers)
      .values({
        ...user,
        points: 0,
        level: 1,
        rank: "EcoAliado",
        league: "Local",
        carbonSaved: 0,
        totalScans: 0,
        createdAt: new Date(),
      })
      .returning();
    return newUser;
  }

  async getEcotramaUserByEmail(email: string): Promise<EcotramaUser | undefined> {
    const [user] = await this.db
      .select()
      .from(ecotramaUsers)
      .where(eq(ecotramaUsers.email, email));
    return user;
  }

  async getEcotramaUser(id: string): Promise<EcotramaUser | undefined> {
    const [user] = await this.db.select().from(ecotramaUsers).where(eq(ecotramaUsers.id, id));
    return user;
  }

  async recordScan(userId: string, wasteType: string, quantity: number): Promise<{ pointsEarned: number; newPoints: number }> {
    const [user] = await this.db
      .select()
      .from(ecotramaUsers)
      .where(eq(ecotramaUsers.id, userId));

    if (!user) throw new Error("User not found");

    const pointsMap: Record<string, number> = {
      "Plástico": 10, "Vidrio": 15, "Metal": 20, "Papel": 5, "Orgánico": 8, "Electrónico": 50
    };
    const pointsEarned = (pointsMap[wasteType] || 10) * quantity;
    const newPoints = (user.points || 0) + pointsEarned;
    const newTotalScans = (user.totalScans || 0) + 1;
    const newRank = this.calculateRank(newPoints);
    const newLeague = this.calculateLeague(newPoints);
    const newCarbon = Math.round(newPoints * 0.5);

    // Transactionally update user and insert scan would be better, but doing sequential for now
    await this.db
      .update(ecotramaUsers)
      .set({
        points: newPoints,
        totalScans: newTotalScans,
        rank: newRank,
        league: newLeague,
        carbonSaved: newCarbon
      })
      .where(eq(ecotramaUsers.id, userId));

    await this.db.insert(scans).values({
      userId,
      wasteType,
      quantity,
      pointsEarned,
      scannedAt: new Date(),
    });

    return { pointsEarned, newPoints };
  }

  async getLeaderboard(): Promise<EcotramaUser[]> {
    return await this.db
      .select()
      .from(ecotramaUsers)
      .orderBy(desc(ecotramaUsers.points))
      .limit(10);
  }

  async addPoints(userId: string, points: number): Promise<EcotramaUser> {
    const [user] = await this.db
      .select()
      .from(ecotramaUsers)
      .where(eq(ecotramaUsers.id, userId));

    if (!user) throw new Error("User not found");

    const newPoints = (user.points || 0) + points;
    const newRank = this.calculateRank(newPoints);
    const newLeague = this.calculateLeague(newPoints);

    const [updatedUser] = await this.db
      .update(ecotramaUsers)
      .set({
        points: newPoints,
        rank: newRank,
        league: newLeague,
      })
      .where(eq(ecotramaUsers.id, userId))
      .returning();

    return updatedUser;
  }
}

export const storage = drizzleDb ? new DatabaseStorage(drizzleDb) : new MemStorage();
