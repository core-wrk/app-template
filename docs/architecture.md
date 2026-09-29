# Architecture

## Components

`apps/web` is a conventional React/Vite application. React Router owns page and protected
route navigation, TanStack Query owns server data, and the small API client centralizes
HTTP requests and credentials.

`apps/api` is a Node 22 process using Hono. Routes are grouped by feature, validate input
with shared Zod schemas, and call the project service for database work. Middleware adds
security headers, CORS, request IDs, logging, and session protection.

`packages/db` owns the PostgreSQL connection, Better Auth tables, project schema, Drizzle
configuration, migrations, and seed script. `packages/shared` contains browser-safe
contracts, types, errors, constants, and the intentionally simple branding configuration.

## Data flow

```text
React page → typed API client → Hono route → auth middleware → service → Drizzle → PostgreSQL
```

The frontend never imports database or authentication-server code. Project queries are
scoped by the authenticated user's ID in every service method, so object IDs alone do not
grant access to another user's project.

## Authentication flow

Better Auth is mounted under `/api/auth/*` and uses its Drizzle adapter. Sign-up and
sign-in create secure cookie-backed sessions. The frontend asks `/api/auth/get-session`
for the current session. Protected API routes call Better Auth's session API using the
request headers and return a consistent `UNAUTHORIZED` error when no session exists.

The schema uses Better Auth's string identifiers for its required tables for adapter
compatibility; application projects use UUIDs. This is the one deliberate exception to
the application UUID convention.

## Portability decisions

The API uses Node and Hono rather than a hosting-provider runtime. PostgreSQL access uses
standard Drizzle with `DATABASE_URL` for API traffic and `DATABASE_URL_DIRECT` for
migrations. Storage is not included until a feature needs it;
when it is added, keep provider code behind a small adapter. The same API Dockerfile is
usable by Render and Cloud Run, while the Vite frontend remains suitable for Cloudflare
Pages or equivalent static hosting.
