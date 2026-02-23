# Facebook Viral Keywords Report DB (Full-Stack)

A modern full-stack searchable database website for viral keywords, hashtags, and content formulas.

## Stack
- Next.js 15 + TypeScript + Tailwind CSS
- Prisma ORM
- MySQL database
- Scheduled ingestion jobs with `node-cron`
- API connectors for Meta Graph, BuzzSumo, and public fallback data source

## Features
- Real-time search across keywords, hashtags, and formulas
- Advanced filters (category, content type, minimum engagement)
- Top 10 trending hashtag badges sorted by usage count
- Copy to clipboard for hashtags and formula templates
- Content Tips page with best posting times and engagement strategies
- Full backend API routes (`/api/search`, `/api/trends`)
- Daily scheduled job for viral data syncing and trend snapshots
- Historical trend storage via daily snapshots

## Quick Start
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy env file:
   ```bash
   cp .env.example .env
   ```
3. Start MySQL:
   ```bash
   docker compose up -d
   ```
4. Run database migration + seed:
   ```bash
   npm run db:migrate -- --name init
   npm run db:seed
   ```
5. Start dev server:
   ```bash
   npm run dev
   ```

## Scheduled Data Jobs
Run ingestion one time:
```bash
npm run job:fetch -- --once
```

Run cron worker (daily at 03:00 UTC):
```bash
npm run job:fetch
```

## API Integrations
Set any keys in `.env`:
- `META_GRAPH_ACCESS_TOKEN`
- `BUZZSUMO_API_KEY`
- `BRANDWATCH_API_KEY` (reserved for extension)

If keys are missing, the app still works with seeded data and public fallback fetches.
