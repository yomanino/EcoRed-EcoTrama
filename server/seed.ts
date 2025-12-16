
import { db, pool } from "./db";
import { blogPosts, recyclingStats, type InsertBlog, type RecyclingStats } from "@shared/schema";
import { randomUUID } from "crypto";

async function seed() {
    console.log("🌱 Seeding database...");

    // Seed Blog Posts
    const samplePosts: InsertBlog[] = [
        {
            title: "¿Por qué es importante la economía circular?",
            slug: "por-que-economia-circular",
            excerpt: "Descubre cómo la economía circular transforma nuestras comunidades y protege el medio ambiente.",
            content: "La economía circular es un modelo sostenible que busca minimizar los residuos...",
            category: "Educación",
            author: "EcoRed Comunal",
            published: true,
            image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=500&h=300&fit=crop",
        },
        {
            title: "Cómo separar correctamente tus residuos",
            slug: "separar-residuos-correctamente",
            excerpt: "Guía práctica para separar residuos en la fuente y maximizar el reciclaje.",
            content: "La separación de residuos en la fuente es fundamental para un reciclaje efectivo...",
            category: "Tutorial",
            author: "EcoRed Comunal",
            published: true,
            image: "/images/family_recycling_v2.jpg",
        },
        {
            title: "Historias de éxito: Comunidades transformadas",
            slug: "historias-exito-comunidades",
            excerpt: "Conoce cómo EcoRed ha transformado comunidades en toda Colombia.",
            content: "Estas son las historias inspiradoras de nuestras comunidades...",
            category: "Historias",
            author: "EcoRed Comunal",
            published: true,
            image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop",
        },
    ];

    console.log("📝 Inserting blog posts...");
    for (const post of samplePosts) {
        await db.insert(blogPosts).values(post);
    }

    // Seed Recycling Stats
    const communities = ["Barrio Cuba", "Comuna San Joaquín", "Zona Centro"];
    console.log("♻️ Inserting recycling stats...");
    for (const community of communities) {
        await db.insert(recyclingStats).values({
            communityName: community,
            materialsRecycled: Math.floor(Math.random() * 5000) + 1000,
            householdsParticipating: Math.floor(Math.random() * 200) + 50,
            co2Reduced: Math.floor(Math.random() * 50) + 10,
            greenJobsCreated: Math.floor(Math.random() * 15) + 3,
            updatedAt: new Date(),
        });
    }

    console.log("✅ Seeding complete!");
    process.exit(0);
}

seed().catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
});
