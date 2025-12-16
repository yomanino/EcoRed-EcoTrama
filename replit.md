# EcoRed Comunal / EcoTrama

## Overview

EcoRed Comunal is a community-focused environmental program promoting circular economy and recycling in Colombia. The project includes EcoTrama, a web application that connects households to create sustainable communities. The platform features a landing page showcasing the program's mission, impact statistics, and a contact form for community engagement.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18+ with TypeScript for type-safe component development
- Vite as the build tool and development server for fast HMR and optimized production builds
- Wouter for lightweight client-side routing
- TanStack Query (React Query) for server state management and API data fetching
- Framer Motion for animations and transitions

**UI Framework:**
- Shadcn/ui component library (New York style variant) providing a comprehensive set of accessible, customizable components
- Radix UI primitives for foundational accessible components
- Tailwind CSS for utility-first styling with custom design system integration

**Design System:**
- Custom color palette with HSL-based theme variables supporting light/dark modes
- Environmental green primary colors (142° hue, 76% saturation, 36% lightness)
- Consistent spacing scale using Tailwind's 4px-based system
- Typography using Inter/DM Sans for headings and system fonts for body text
- Custom border radius values (9px/6px/3px) and shadow system

**Form Handling:**
- React Hook Form for performant form state management
- Zod for runtime schema validation
- @hookform/resolvers for integration between React Hook Form and Zod

**State Management Pattern:**
- Server state managed via TanStack Query with configured defaults (no refetch on window focus, infinite stale time)
- Local UI state managed with React hooks
- Form state isolated to React Hook Form

### Backend Architecture

**Server Framework:**
- Express.js for HTTP server and API routing
- TypeScript for type safety across the stack
- Custom development/production server setup with separate entry points

**Development vs Production:**
- Development: Vite dev server integrated as Express middleware with HMR support
- Production: Static file serving from pre-built dist directory
- Replit-specific plugins for development tooling (cartographer, dev banner, runtime error overlay)

**API Structure:**
- RESTful endpoints under `/api` prefix
- `/api/contact` - POST endpoint for contact form submissions, GET endpoint for retrieving messages
- Request/response validation using Zod schemas
- Centralized error handling with structured error responses

**Data Layer:**
- In-memory storage implementation (MemStorage) for development
- Interface-based storage pattern (IStorage) allowing easy swap to persistent database
- Prepared for Drizzle ORM integration with PostgreSQL

**Database Schema (Prepared):**
- Drizzle ORM configured for PostgreSQL via Neon serverless
- Schema definitions in shared directory for type sharing between client/server
- Users table with UUID primary keys, username/password fields
- Migration system configured (drizzle-kit)

### Build System

**Module Resolution:**
- ESM modules throughout the codebase
- Path aliases configured: `@/` for client src, `@shared/` for shared code, `@assets/` for static assets
- Bundler-based module resolution for TypeScript

**Build Pipeline:**
- Client: Vite builds React app to `dist/public`
- Server: esbuild bundles Node.js server to `dist/index.js` with external package references
- Single production artifact combining both client and server builds

**Type Checking:**
- Strict TypeScript configuration across client, server, and shared code
- Incremental compilation with build info caching
- No emit mode for type checking (building handled by Vite/esbuild)

### Code Organization

**Monorepo Structure:**
- `/client` - Frontend React application
- `/server` - Express backend
- `/shared` - Shared types, schemas, and validation logic
- `/attached_assets` - Static HTML references and design mockups

**Shared Code Pattern:**
- Zod schemas defined once in `/shared/schema.ts`
- Type inference from schemas using Zod and Drizzle
- Runtime validation on both client and server using same schemas

## External Dependencies

### Database & ORM
- **Neon Serverless PostgreSQL** (@neondatabase/serverless) - Serverless PostgreSQL database provider
- **Drizzle ORM** - Type-safe SQL ORM for schema definition and queries
- **Drizzle-Zod** - Integration between Drizzle schemas and Zod validation

### UI Component Libraries
- **Radix UI** - 20+ primitive components for accessible UI building blocks (dialogs, dropdowns, popovers, tooltips, etc.)
- **Shadcn/ui** - Pre-styled component library built on Radix UI
- **Lucide React** - Icon library
- **React Icons** - Additional icon set for social media (LinkedIn, X/Twitter, Instagram)

### Styling & Animation
- **Tailwind CSS** - Utility-first CSS framework
- **Class Variance Authority** - Variant-based component styling
- **Framer Motion** - Animation library for React
- **Embla Carousel** - Carousel/slider component

### Forms & Validation
- **React Hook Form** - Performant form library with minimal re-renders
- **Zod** - TypeScript-first schema validation
- **@hookform/resolvers** - Validation resolver integration

### Development Tools
- **Replit Vite Plugins** - Development tooling (cartographer, dev banner, runtime error modal)
- **PostCSS** & **Autoprefixer** - CSS processing
- **ESBuild** - Fast JavaScript bundler for production server build

### Utilities
- **date-fns** - Date manipulation and formatting
- **nanoid** - Unique ID generation
- **cmdk** - Command palette component
- **clsx** & **tailwind-merge** - Utility for conditional class names

### Session Management (Prepared)
- **connect-pg-simple** - PostgreSQL session store for Express sessions (configured but not yet implemented)