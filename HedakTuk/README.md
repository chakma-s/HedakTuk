# 🍔 HedakTuk App

> A full-stack Zomato/Swiggy-style food delivery platform built with React Native, NestJS, and PostgreSQL.

## Tech Stack

| Layer | Technology |
|---|---|
| **Mobile App** | React Native (Expo) |
| **Backend API** | NestJS + TypeScript |
| **Database** | PostgreSQL 16 (PostGIS) |
| **Cache** | Redis 7 |
| **Real-time** | Socket.IO |
| **Admin Panel** | Next.js 14 |
| **Monorepo** | Turborepo + npm workspaces |

## Project Structure

```
hedaktuk-app/
├── apps/
│   ├── api/          # NestJS Backend API
│   ├── mobile/       # React Native (Expo) App
│   └── admin-web/    # Next.js Admin Panel
├── packages/
│   └── shared-types/ # Shared TypeScript interfaces
├── docker-compose.yml
├── turbo.json
└── .env.example
```

## Quick Start

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- npm 10+

### 1. Clone & Install

```bash
git clone <repo-url>
cd hedaktuk-app
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
# Edit .env with your values
```

### 3. Start Database & Redis

```bash
docker compose up -d
```

### 4. Run Database Migrations

```bash
cd apps/api
npx prisma migrate dev --name init
npx prisma generate
cd ../..
```

### 5. Start Development

```bash
# Start all apps
npm run dev

# Or start individually
cd apps/api && npm run dev      # Backend on :3000
cd apps/admin-web && npm run dev # Admin on :3001
cd apps/mobile && npx expo start # Mobile app
```

### 6. API Documentation

Once the backend is running, visit: **<http://localhost:3000/api/docs>** for Swagger docs.

## Backend Modules

| Module | Endpoints | Description |
|---|---|---|
| **Auth** | `/api/v1/auth/*` | OTP login with new Glassmorphism UI, JWT refresh |
| **Users** | `/api/v1/users/*` | Profile onboarding, addresses |
| **Restaurants** | `/api/v1/restaurants/*` | Search, filters, CRUD |
| **Menu** | `/api/v1/restaurants/:id/menu/*` | Categories, items |
| **Cart** | `/api/v1/cart/*` | Add, remove, clear |
| **Orders** | `/api/v1/orders/*` | Place, track, cancel |
| **Payments** | `/api/v1/payments/*` | Initiate, webhook |

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start all apps in development mode |
| `npm run build` | Build all apps |
| `npm run lint` | Lint all apps |
| `npm run test` | Run all tests |

## License

Private — All rights reserved.
