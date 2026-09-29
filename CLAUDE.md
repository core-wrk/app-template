# Claude Code instructions

Follow `AGENTS.md` as the shared operating guidance for this repository. This is a
small, portable React/Vite + Hono + PostgreSQL starter for early-stage products.

Make the smallest complete change, reuse existing patterns, and keep business logic in
the API service layer. Do not add microservices, queues, CQRS, Kubernetes, speculative
caching, or other infrastructure without a concrete requirement. Validate inputs with
the shared Zod schemas and keep authorization checks server-side.

Before handing off a meaningful change, run `pnpm verify` and report its result. Never
commit secrets or make destructive production changes without explicit human approval.
