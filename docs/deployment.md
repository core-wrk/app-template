# Deployment

The starter separates application code from provider configuration so the prototype path
can stay inexpensive and the production path can evolve without a rewrite.

Create each app's resources under the shared Core Wrk service accounts while keeping its
database, API service, frontend project, storage bucket set, and auth secret isolated. See
[account-standardization.md](account-standardization.md) for the naming and ownership model.

## Prototype: Cloudflare Pages + Render + Neon

1. Create one Neon project for this app under the Core Wrk organization. Start on the Free
   plan with PostgreSQL 18 in AWS N. Virginia (`us-east-1`), using Postgres only. Keep
   Neon Auth, Data API, Storage, Functions, and AI Gateway off.
2. Use `main` for production data and a persistent `dev` branch for synthetic data. Create
   feature and preview branches from `dev`, not from `main` after it has customer data.
3. Set `DATABASE_URL` to the branch's pooled PostgreSQL URL and `DATABASE_URL_DIRECT` to
   its direct URL in the trusted environment that applies migrations. Apply committed
   migrations with `pnpm db:migrate` to the intended branch.
4. Create a Render web service using the repository root as context and
   `apps/api/Dockerfile` as the Dockerfile. Set `DATABASE_URL`, `WEB_ORIGIN`, `NODE_ENV=production`,
   and a Render-provided `PORT`.
5. Deploy `apps/web` to Cloudflare Pages with build command `pnpm build` and output directory
   `apps/web/dist`. Set `VITE_API_URL` to the public Render API URL.
6. Set `WEB_ORIGIN` on Render to the Cloudflare Pages URL. Add the preview origin too if needed.

Use Neon project-scoped API keys for coding agents so an agent working on this app cannot
manage other apps' projects. Keep keys and connection strings out of Git. For local Neon
work, `neon link`, `neon checkout <branch>`, and `neon env pull` select a branch and fetch
its URLs. Neon names the direct URL `DATABASE_URL_UNPOOLED`; copy that value to this
starter's `DATABASE_URL_DIRECT`. Check that both URLs target the intended branch before
running migrations. Keep development and preview computes set to suspend when idle.

Cloudflare R2 is the default future object-storage choice. It is not part of the reference
app until file handling is needed.

## Production: Cloud Run + Neon or Cloud SQL

Build and deploy the same API image to Cloud Run. Configure `DATABASE_URL`, `WEB_ORIGIN`,
`NODE_ENV=production`, and let Cloud Run provide `PORT`. The container listens on that port,
runs as the non-root `node` user, and contains no secrets.

Cloud SQL PostgreSQL is supported by changing `DATABASE_URL`, `DATABASE_URL_DIRECT`, and
the connection/network configuration. Keep migrations in the repository and apply them
during a controlled release.
The frontend can remain on Cloudflare Pages.

## Provider transitions

- Render → Cloud Run: build the existing `apps/api/Dockerfile` with a Cloud Build or local
  Docker pipeline, then change deployment configuration and environment variables.
- Neon free → Neon paid: change the database plan and connection settings; schema and code stay put.
- Neon → Cloud SQL: provision the target PostgreSQL instance, migrate data with PostgreSQL
  tools, change both database URLs, and run a smoke test.
- R2 → Google Cloud Storage: add a storage adapter behind the application boundary and change
  configuration; do not spread provider SDK calls through routes.

The optional workflow is intentionally disabled until a project supplies its provider IDs,
credentials, and release policy.
