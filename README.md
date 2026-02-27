## Next.js App Router Scaffold

This repository is scaffolded as a **Next.js (App Router) TypeScript** project with:

- TailwindCSS
- shadcn/ui baseline config + Button component
- ESLint + Prettier
- Node.js runtime (via `export const runtime = "nodejs"` in `app/layout.tsx`)
- Prisma ORM with MongoDB provider + seed script
- Auth.js (NextAuth credentials), roles (`USER`/`ADMIN`), middleware protection, and security headers
- Framer Motion animated landing page with 8 responsive sections, centered-logo navbar, gradient CTA, and footer
- Explore + Trending feeds with search, filters (type/category/tag), skeleton loaders, and empty states
- User dashboard (`/user-dashboard`) with tip of the day, daily tips feed, recommendations, and favorites
- Content routes for `/news`, `/blogs`, and `/creators-advice` with favorite toggles
- Commenting on blogs/news only, with admin moderation actions (hide/delete/restore)

### Scripts

- `npm run dev` – start development server
- `npm run build` – production build
- `npm run start` – serve production build
- `npm run lint` – lint with Next.js ESLint config
- `npm run format` – format code with Prettier
- `npm run format:check` – check Prettier formatting
- `npm run prisma:generate` – generate Prisma Client
- `npm run prisma:dbpush` – push Prisma schema to MongoDB
- `npm run prisma:seed` – seed sample data into MongoDB

### Security implemented

- Credentials auth with Auth.js using bcrypt password verification
- User roles (`USER`, `ADMIN`) in Prisma schema
- Route protection in `middleware.ts`:
  - `/dashboard` requires sign-in
  - `/admin` requires `ADMIN`
- Rate limiting for `/api/auth/*` requests (429 with `Retry-After`)
- Login lockout after repeated failures (configurable constants in `lib/security.ts`)
- Security headers on all responses: CSP, HSTS, X-Frame-Options, Referrer-Policy, and more

### Getting started

```bash
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:dbpush
npm run prisma:seed
npm run dev
```

### Seed credentials

- `admin@example.com` / `AdminPass123!` (role: `ADMIN`)
- `writer@example.com` / `WriterPass123!` (role: `USER`)
