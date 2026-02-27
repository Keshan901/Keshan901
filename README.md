## Monorepo Structure

- `/frontend` — Next.js App Router frontend
- `/backend` — Node.js (Express) API server + Prisma (MongoDB)

## 1) Run backend

```bash
cd backend
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:dbpush
npm run prisma:seed
npm run dev
```

Backend API starts at: `http://localhost:4000/api`

## 2) Run frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

Frontend starts at: `http://localhost:3000`

## API connection

Frontend reads API URL from:

- `NEXT_PUBLIC_API_URL` (default: `http://localhost:4000/api`)

CORS is enabled in backend for `FRONTEND_URL`.
