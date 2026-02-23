# Facebook Viral Keywords Report DB (Full-Stack)

Modern full-stack searchable database website for viral keywords, hashtags, formulas, and tips with admin + user access flows.

## Highlights
- Maintenance-safe behavior when APIs/data calls fail (`"This in maintence mode recover soonly"`).
- Expanded navigation: Home, Popular Tags, Explore, Blogs, My Favorites, Sign-in, Join with us.
- User sign-in/sign-up flows and protected pages (`/favorites`, `/explore`).
- Homepage pagination with **Show more** behavior:
  - not signed-in users see a fade-in signup card
  - signed-in users are redirected to `/explore`
- Admin CRUD for hashtags, keywords, formulas, tips, settings, and API keys.
- API key placeholders configurable from admin (meta-graph, twitter-v2, public-trends).

## Stack
- Next.js 15 + TypeScript + Tailwind CSS
- Prisma ORM + MySQL
- Recharts analytics dashboards
- Scheduled ingestion jobs with `node-cron`
- Multi-provider API integration (Meta Graph, Twitter API, Reddit/HackerNews public fallback)

## Main Routes
- `/` home dashboard
- `/explore` full results + banner + advanced filter section
- `/favorites` protected favorites landing
- `/sign-in`, `/sign-up`
- `/tips`
- `/admin`

## API Endpoints
Public:
- `GET /api/search`
- `GET /api/trends`
- `GET /api/export?type=hashtags|formulas`
- `POST/DELETE /api/auth/user`

Admin:
- `POST/DELETE /api/admin/auth`
- `GET /api/admin/overview`
- `GET/PATCH /api/admin/users`
- `GET/PUT /api/admin/settings`
- `GET/PUT/POST /api/admin/apis`
- `GET/POST/PUT/DELETE /api/admin/hashtags`
- `GET/POST/PUT/DELETE /api/admin/keywords`
- `GET/POST/PUT/DELETE /api/admin/formulas`
- `GET/POST/PUT/DELETE /api/admin/tips`
- `GET /api/admin/analytics`

## Quick Start
1. `npm install`
2. `cp .env.example .env`
3. `docker compose up -d`
4. `npm run db:migrate -- --name init`
5. `npm run db:seed`
6. `npm run dev`

Seeded accounts:
- Admin: `admin@viral.local` / `password`
- Editor: `editor@viral.local` / `password`

## Tests
- Run: `npm test`
