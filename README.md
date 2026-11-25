# Core Wrk App Starter

A small, production-capable monorepo for prototyping ordinary web applications with AI
coding agents. It gives a new project a conventional React frontend, a portable Node API,
a PostgreSQL schema, authentication, tests, and low-cost deployment documentation.

## Architecture

```text
apps/web   React + Vite + TypeScript + Tailwind + React Router + TanStack Query
apps/api   Hono + TypeScript REST API under /api
packages/db      PostgreSQL + Drizzle schema, migrations, and seed
packages/shared  Zod contracts, types, constants, and white-label branding
```

The browser talks to the API over HTTP. The API owns authorization and business logic.
The database uses standard PostgreSQL and can run locally, on Neon, or on Cloud SQL.
The API Dockerfile runs on both Render and Cloud Run.

## Quick start

Prerequisites: Node.js 22+, pnpm 10+, and Docker Desktop (for local PostgreSQL).

```bash
pnpm install
cp .env.example .env.local
pnpm db:up
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173), create an account, and use the
dashboard to create, edit, view, and delete projects. The API health check is at
`http://localhost:8787/api/health`.

For a guided, idempotent setup, use `./scripts/bootstrap.sh`.

## Environment

Copy `.env.example` to `.env.local`. `DATABASE_URL` is the API's PostgreSQL connection;
`DATABASE_URL_DIRECT` is the direct connection used by Drizzle migrations. They point to
the same local database. On Neon, use the pooled URL for `DATABASE_URL` and the direct
URL for `DATABASE_URL_DIRECT`. `PORT` and `WEB_ORIGIN` configure the API. `VITE_API_URL`
configures where the browser sends API requests; leave it set to `http://localhost:8787`
for local development. Never commit `.env.local` or secrets.

## Common commands

```text
pnpm dev          Start web and API in parallel
pnpm build        Build packages, API, and web
pnpm test         Run shared, API, and frontend tests
pnpm lint         Run ESLint
pnpm typecheck    Run strict TypeScript checks
pnpm verify       Run typecheck, lint, tests, and build
pnpm db:up        Start local PostgreSQL
pnpm db:generate  Generate a Drizzle migration from schema changes
pnpm db:migrate   Apply migrations
pnpm db:seed      Add safe sample data
pnpm db:reset     Recreate the local Docker database and seed it
```

## Deployment options

The low-cost prototype path is Cloudflare Pages for `apps/web`, Render using
`apps/api/Dockerfile` for the API, and Neon PostgreSQL. Use one Neon project per app;
keep production data on `main` and synthetic development data on `dev`. Production can
move the API to Google Cloud Run and the database to Neon paid or Cloud SQL without
changing application business logic. See [docs/deployment.md](docs/deployment.md).

## Account standardization

Use one Core Wrk GitHub organization, Neon organization, Render workspace, and Cloudflare
account, with a separate repository, database/project, API service, frontend project, storage
bucket set, and auth secret per application. This keeps administration centralized while
preserving clean isolation. See [docs/account-standardization.md](docs/account-standardization.md).

## Create a new project

Run the lightweight metadata helper from a copy of this starter:

```bash
./scripts/create-project.sh my-new-app
```

It can also accept package namespace, title, API port, and web port as the second through
fifth arguments. Review the changes, run `pnpm install`, and initialize a new Git repo.

## Lovable integration

Lovable is optional. Export or sync its conventional React/Vite frontend into
`apps/web`, preserve the existing `src/lib/api` boundary, and replace direct Supabase
calls with the typed functions in `apps/web/src/lib/api`. Keep the Hono API independent
of Lovable so the application remains fully editable outside the visual tool.

## Agent workflow

Read `AGENTS.md`, `CLAUDE.md`, or `CODEX.md` before editing. Make the smallest complete
change, keep schema changes in Drizzle migrations, add focused tests for behavior, and
finish with `pnpm verify`. Avoid ceremonial reports and premature platform complexity.

## Commercialization and white-labeling

Core Wrk uses the starter for consulting, implementation, and managed deployments.
Customer-specific logic and credentials belong in the applications built from it.
Visible application metadata lives in `packages/shared/src/config/branding.ts`.
See [docs/commercialization.md](docs/commercialization.md).

## License

Copyright 2026 Core Wrk LLC. Licensed under the [Apache License 2.0](LICENSE).
