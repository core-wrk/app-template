# Agent guidance

This starter is optimized for early-stage product development and rapid iteration.
Prefer the smallest practical implementation that satisfies the requirement. Keep the
frontend, API, database, and deployment configuration explicit and easy to inspect.

## Architecture constraints

Do not introduce microservices, Kubernetes, event-driven architecture, message queues,
CQRS, event sourcing, service meshes, multiple databases, speculative caching,
dependency-injection containers, or infrastructure platforms unless a concrete product
requirement justifies the change. Keep ordinary CRUD in the existing service pattern.

## Decision hierarchy

Prefer: the existing project pattern, the simplest code change, an existing dependency,
a standard platform capability, a small dependency, an abstraction, a new service, and
then new infrastructure. Explain any decision in the last three categories.

## Security and review

Validate external input, authorize on the server, keep secrets in environment files, and
preserve secure cookie and CORS settings. Low-risk local development work can proceed
autonomously. Ask for review before destructive production database work, authentication
or security-boundary changes, billing changes, production infrastructure deletion, or
secrets/access-control changes.

## Evidence

Use `pnpm verify` as the normal completion check. It runs typecheck, lint, tests, and the
production builds. Add targeted tests for business behavior and security boundaries.

## Neon database workflow

Use one Neon project per application. In that project, `main` holds production data and
`dev` holds synthetic development data. Create feature and preview database branches
from `dev`, never from `main` after it contains customer data. Match the database branch
to the Git branch or worktree when using Neon. Keep schema changes in committed Drizzle
migrations, and inspect a schema diff before applying them.

The API uses the pooled PostgreSQL `DATABASE_URL`; Drizzle migrations use the direct
`DATABASE_URL_DIRECT`. Keep both URLs for the same database branch. Give coding agents
project-scoped Neon API keys, not organization-wide keys. Use the Neon CLI's `link`,
`checkout`, and `env pull` commands when working on a linked Neon project; map its
`DATABASE_URL_UNPOOLED` value to this starter's `DATABASE_URL_DIRECT`. Do not enable Neon
Auth, Data API, Storage, Functions, or AI Gateway for this starter.
