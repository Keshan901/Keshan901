# Facebook Viral Keywords Report DB (Full-Stack)

Modern full-stack searchable database website for viral keywords, hashtags, formulas, and tips with an admin control panel.

## Stack
- Next.js 15 + TypeScript + Tailwind CSS
- Prisma ORM + MySQL
- Recharts analytics dashboards
- Scheduled ingestion jobs with `node-cron`
- Multi-provider API integration (Meta Graph, Twitter API, Reddit/HackerNews public fallback)

## New Admin & Data Capabilities
- `/admin` dashboard with management tabs and CRUD tools.
- CRUD for keywords, hashtags, formulas, tips, and settings.
- API key management tab with placeholder providers ready for credentials.
- Role-based access control (admin-only protected management endpoints).
- CSV export for hashtags and formulas.

## Database Models
Core models:
- Keyword
- Hashtag
- ContentFormula
- ContentTip
- DailyTrendSnapshot

Six admin/ops models:
- UserAccount
- AdminSession
- SiteSetting
- ApiCredential
- HashtagCategory
- AnalyticsEvent

## API Endpoints
Public:
- `GET /api/search`
- `GET /api/trends`
- `GET /api/export?type=hashtags|formulas`

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

Seeded admin login:
- `admin@viral.local`

## Jobs
- One-time ingest: `npm run job:fetch -- --once`
- Scheduler worker: `npm run job:fetch` (daily at 03:00 UTC)

## Tests
- Run: `npm test`
