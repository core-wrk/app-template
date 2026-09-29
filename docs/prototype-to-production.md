# Prototype to production

## Stage 0 — local experiment

Use Docker PostgreSQL, local Node processes, and `.env.local`. The goal is fast feedback.
Nothing needs to be hosted yet.

## Stage 1 — free hosted prototype

Put the Vite frontend on Cloudflare Pages, the API on Render, and PostgreSQL on Neon. Add
the hosted origins to configuration. The application code and migration history do not change.

## Stage 2 — private beta

Use a paid database plan if reliability requires it, back up the data, configure a real
domain, and add basic rate limiting/monitoring. Keep the same API routes, auth implementation,
and frontend boundary.

## Stage 3 — production hardening

Move the API to Cloud Run if its operational needs justify it. Review cookie settings, CORS,
secret rotation, migrations, backups, error reporting, and the optional object-storage adapter.
The Node/Hono container and Better Auth implementation remain the same.

## Stage 4 — scale only when required

Measure before adding queues, caches, workers, or additional services. Introduce one targeted
change for one demonstrated bottleneck, keeping the existing application boundaries intact.

## What does not need to change

The React frontend still uses HTTP, the API still owns business rules, PostgreSQL remains the
database contract, Better Auth remains the session system, and migrations remain versioned in Git.
