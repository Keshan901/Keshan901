# ViralVault

Production-ready creator toolkit for viral keywords, hashtags, and daily insights.

## Requirements
- Node.js 20+
- npm 10+
- MongoDB database

## Setup
1. Copy envs:
   ```bash
   cp .env.example .env
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Generate Prisma client + push schema:
   ```bash
   npm run prisma:generate
   npm run prisma:push
   ```
4. Seed demo data:
   ```bash
   npm run prisma:seed
   ```
5. Start app:
   ```bash
   npm run dev
   ```

## Build + Run
```bash
npm run build
npm run start
```

## Environment variables
- `DATABASE_URL`: Mongo connection URL
- `NEXTAUTH_SECRET`: secret for session/JWT signing
- `NEXTAUTH_URL`: canonical app URL
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`: optional OAuth
- `ADMIN_EMAIL` / `ADMIN_PASSWORD`: admin account created by seed

## Security included
- Secure headers via middleware
- CSRF-safe auth flow using NextAuth
- JWT-based protected dashboard/admin routes
- Auth rate limiting + lockout protection
- Zod validation on all write endpoints
- Markdown sanitization for blog rendering

## Project structure
- `app/` routes, pages, and API handlers
- `components/` shared UI + feature components
- `lib/` auth, prisma, validators, security utilities
- `prisma/` schema + seed
