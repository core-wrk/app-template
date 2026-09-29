# Local development

## Prerequisites

- Node.js 22 or newer
- pnpm 10 or newer (`corepack enable` is the simplest setup)
- Docker Desktop, if using the included PostgreSQL service

## Setup

```bash
pnpm install
cp .env.example .env.local
pnpm db:up
pnpm db:migrate
pnpm db:seed
pnpm dev
```

`apps/web` runs on port 5173 and `apps/api` on 8787 by default. The database is exposed
on port 5432 with the development credentials in `docker-compose.yml`. These credentials
are for local use only. Both database URLs in `.env.example` point to that local server.

`./scripts/bootstrap.sh` performs the same sequence and creates `.env.local` if missing.
It can use a reachable PostgreSQL instance instead of Docker when `DATABASE_URL` is set.
For hosted PostgreSQL, set `DATABASE_URL_DIRECT` to the direct connection for the same
database before running Drizzle migrations. If it is unset, Drizzle falls back to
`DATABASE_URL` for existing local setups.

## Database workflow

Change `packages/db/src/schema`, then inspect a generated migration:

```bash
pnpm db:generate
pnpm db:migrate
```

Never edit a deployed schema manually. To rebuild the disposable local database:

```bash
pnpm db:reset
```

This removes the local Docker volume, recreates PostgreSQL, applies migrations, and seeds
sample data. It is intentionally guarded against `NODE_ENV=production`.

## Troubleshooting

- If the API cannot connect, check `DATABASE_URL` and `docker compose ps`.
- If the browser reports a CORS error, make `WEB_ORIGIN` match the web URL and restart the API.
- If a session looks stale, sign out and sign in again; cookies belong to the API origin.
- If pnpm is unavailable, run `corepack enable` and retry.
- Run `pnpm verify` after dependency or configuration changes.
