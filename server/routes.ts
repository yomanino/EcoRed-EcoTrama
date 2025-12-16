import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { contactMessageSchema, insertNewsletterSchema, insertBlogSchema, insertEcotramaUserSchema } from "@shared/schema";

import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  app.post("/api/contact", async (req, res) => {
    try {
      const result = contactMessageSchema.safeParse(req.body);

      if (!result.success) {
        return res.status(400).json({
          message: "Datos inválidos",
          errors: result.error.flatten().fieldErrors
        });
      }

      const message = await storage.createContactMessage(result.data);

      console.log("Nuevo mensaje de contacto recibido:", {
        id: message.id,
        name: message.name,
        email: message.email,
        createdAt: message.createdAt,
      });

      return res.status(201).json({
        message: "Mensaje enviado correctamente",
        id: message.id
      });
    } catch (error) {
      console.error("Error al procesar mensaje de contacto:", error);
      return res.status(500).json({
        message: "Error interno del servidor"
      });
    }
  });

  app.get("/api/contact", async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      return res.json(messages);
    } catch (error) {
      console.error("Error al obtener mensajes:", error);
      return res.status(500).json({
        message: "Error interno del servidor"
      });
    }
  });

  app.post("/api/newsletter", async (req, res) => {
    try {
      const result = insertNewsletterSchema.safeParse(req.body);

      if (!result.success) {
        return res.status(400).json({
          message: "Email inválido",
          errors: result.error.flatten().fieldErrors
        });
      }

      const subscriber = await storage.subscribeNewsletter(result.data);

      console.log("Nuevo suscriptor al boletín:", {
        id: subscriber.id,
        email: subscriber.email,
        subscribedAt: subscriber.subscribedAt,
      });

      return res.status(201).json({
        message: "Suscripción exitosa. Gracias por tu interés en EcoRed Comunal.",
        id: subscriber.id
      });
    } catch (error) {
      console.error("Error al procesar suscripción:", error);
      return res.status(500).json({
        message: "Error interno del servidor"
      });
    }
  });

  app.get("/api/blog", async (req, res) => {
    try {
      const posts = await storage.getBlogPosts();
      return res.json(posts);
    } catch (error) {
      console.error("Error al obtener posts:", error);
      return res.status(500).json({
        message: "Error interno del servidor"
      });
    }
  });

  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post) {
        return res.status(404).json({ message: "Post no encontrado" });
      }
      return res.json(post);
    } catch (error) {
      console.error("Error al obtener post:", error);
      return res.status(500).json({
        message: "Error interno del servidor"
      });
    }
  });

  app.post("/api/blog", async (req, res) => {
    try {
      const result = insertBlogSchema.safeParse(req.body);

      if (!result.success) {
        return res.status(400).json({
          message: "Datos inválidos",
          errors: result.error.flatten().fieldErrors
        });
      }

      const post = await storage.createBlogPost(result.data);
      return res.status(201).json(post);
    } catch (error) {
      console.error("Error al crear post:", error);
      return res.status(500).json({
        message: "Error interno del servidor"
      });
    }
  });

  app.get("/api/recycling-stats", async (req, res) => {
    try {
      const stats = await storage.getRecyclingStats();
      return res.json(stats);
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
      return res.status(500).json({
        message: "Error interno del servidor"
      });
    }
  });

  app.post("/api/ecotrama/users", async (req, res) => {
    try {
      const result = insertEcotramaUserSchema.safeParse(req.body);

      if (!result.success) {
        return res.status(400).json({
          message: "Datos inválidos",
          errors: result.error.flatten().fieldErrors
        });
      }

      const user = await storage.createEcotramaUser(result.data);
      return res.status(201).json(user);
    } catch (error) {
      console.error("Error al crear usuario EcoTrama:", error);
      return res.status(500).json({
        message: "Error interno del servidor"
      });
    }
  });

  app.post("/api/ecotrama/scan", async (req, res) => {
    try {
      const quantity = req.body.quantity;
      const wasteType = req.body.wasteType;
      // Use authenticated user ID if available, otherwise fallback to body provided (for testing/legacy)
      const userId = req.isAuthenticated() ? req.user!.id : req.body.userId;

      if (!userId || !wasteType || !quantity) {
        return res.status(400).json({
          message: "Datos inválidos"
        });
      }

      const result = await storage.recordScan(userId, wasteType, quantity);
      return res.json(result);
    } catch (error) {
      console.error("Error al registrar escaneo:", error);
      return res.status(500).json({
        message: "Error interno del servidor"
      });
    }
  });

  app.get("/api/ecotrama/leaderboard", async (req, res) => {
    try {
      const leaderboard = await storage.getLeaderboard();
      res.json(leaderboard);
    } catch (err) {
      res.status(500).json({ message: "Error fetching leaderboard" });
    }
  });

  app.post("/api/ecotrama/education/complete", async (req, res) => {
    try {
      const points = 50; // Fixed points for reading an article
      const userId = req.isAuthenticated() ? req.user!.id : req.body.userId; // Fallback for dev

      if (!userId) {
        return res.status(401).json({ message: "No autenticado" });
      }

      const updatedUser = await storage.addPoints(userId, points);
      return res.json({
        message: "Puntos añadidos",
        user: updatedUser,
        pointsEarned: points
      });
    } catch (err) {
      console.error("Error completing education:", err);
      res.status(500).json({ message: "Error interno" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
