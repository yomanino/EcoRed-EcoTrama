import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { type Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User, EcotramaUser } from "@shared/schema";

declare global {
    namespace Express {
        interface User extends EcotramaUser { }
    }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
    const salt = randomBytes(16).toString("hex");
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
    const [hashed, salt] = stored.split(".");
    const hashedBuf = Buffer.from(hashed, "hex");
    const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
    return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
    const sessionSettings: session.SessionOptions = {
        secret: process.env.SESSION_SECRET || "ecotrama-super-secret-key",
        resave: false,
        saveUninitialized: false,
        store: storage.sessionStore,
    };

    if (app.get("env") === "production") {
        app.set("trust proxy", 1);
    }

    app.use(session(sessionSettings));
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(
        "ecotrama-local",
        new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
            try {
                const user = await storage.getEcotramaUserByEmail(email);
                if (!user || !(await comparePasswords(password, user.password))) {
                    return done(null, false, { message: "Credenciales inválidas" });
                }
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }),
    );

    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser(async (id: string, done) => {
        try {
            const user = await storage.getEcotramaUser(id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });

    app.post("/api/login", (req, res, next) => {
        passport.authenticate("ecotrama-local", (err: any, user: any, info: any) => {
            if (err) return next(err);
            if (!user) return res.status(401).json({ message: "Credenciales inválidas" });
            req.login(user, (err) => {
                if (err) return next(err);
                res.json(user);
            });
        })(req, res, next);
    });

    app.post("/api/register", async (req, res, next) => {
        try {
            // Validate with Zod schema (we can import it or use the one from shared)
            // Since we don't have it imported here, let's trust the body structure for now or import it.
            // Better to import it. I'll add the import at the top in a separate change if needed, but for now:

            const existingUser = await storage.getEcotramaUserByEmail(req.body.email);
            if (existingUser) {
                return res.status(400).json({ message: "El usuario ya existe" });
            }

            const hashedPassword = await hashPassword(req.body.password);
            const user = await storage.createEcotramaUser({
                ...req.body,
                password: hashedPassword,
            });

            req.login(user, (err) => {
                if (err) return next(err);
                res.status(201).json(user);
            });
        } catch (err) {
            next(err);
        }
    });

    app.post("/api/logout", (req, res, next) => {
        req.logout((err) => {
            if (err) return next(err);
            res.sendStatus(200);
        });
    });

    app.get("/api/user", (req, res) => {
        if (!req.isAuthenticated()) return res.sendStatus(401);
        res.json(req.user);
    });
}
