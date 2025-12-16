# Deploying EcoRed Comunal to Vercel

The project is fully configured for deployment on Vercel. Follow these steps to get your app live.

## Prerequisites

1.  A [Vercel](https://vercel.com) account.
2.  A [GitHub](https://github.com) account (recommended) or Vercel CLI.
3.  A PostgreSQL database (e.g., [Neon.tech](https://neon.tech), [Supabase](https://supabase.com), or Vercel Postgres).

## Environment Variables

You will need to set the following environment variable in your Vercel project settings:

- `DATABASE_URL`: The connection string to your PostgreSQL database.
    - *Format*: `postgres://user:password@host:port/database?sslmode=require`

## Deployment Steps (GitHub Integration - Recommended)

1.  **Push to GitHub**: Ensure your latest code is pushed to your GitHub repository.
2.  **Import to Vercel**:
    - Go to your Vercel Dashboard.
    - Click **"Add New..."** -> **"Project"**.
    - Select your `EcoRedComunal` (or named) repository.
3.  **Configure Project**:
    - **Framework Preset**: Vercel should auto-detect "Vite" or "Other". If not, select **Vite**.
    - **Root Directory**: `./` (default).
    - **Build Command**: `npm run build` (default).
    - **Output Directory**: `dist` (default).
4.  **Add Environment Variables**:
    - Expand the "Environment Variables" section.
    - Key: `DATABASE_URL`
    - Value: `[Your actual database connection string]`
    - Click **Add**.
5.  **Deploy**: Click **Deploy**.

## Deployment Steps (Vercel CLI)

If you prefer using the command line:

1.  Open your terminal in the project folder.
2.  Run `npx vercel login` if you haven't already.
3.  Run `npx vercel deploy`.
4.  Follow the prompts:
    - Set up and deploy? **Yes**
    - Which scope? **[Your Name]**
    - Link to existing project? **No**
    - Project name? **ecored-comunal** (or your choice)
    - In which directory? **./**
    - Want to modify these settings? **No** (The project defaults are correct)
5.  **Important**: After the first deployment (which might fail if DB is missing), go to the Vercel Dashboard for this project, add the `DATABASE_URL` environment variable, and redeploy.

## Verifying Deployment

1.  Open the URL provided by Vercel.
2.  Test the **Scanner**: Go to "Escanear Residuo" and try scanning.
3.  Test **Login/Register**: Ensure you can create an account (this verifies database connection).
