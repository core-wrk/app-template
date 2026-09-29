# Codex instructions

Follow `AGENTS.md` as the shared operating guidance for this repository. Optimize for
learning velocity and correctness in the current requirement, not theoretical scale.

Prefer the existing React/Vite frontend, Hono API, Drizzle database, Better Auth, and
shared Zod patterns. Keep routes thin, keep non-trivial business logic in services, and
avoid new abstractions or infrastructure unless the requirement makes them necessary.
Protect API routes on the server, use secure cookies in production, and keep environment
secrets untracked.

Use `pnpm verify` for the minimum useful evidence before completion. Escalate only for
destructive production operations, auth/security-boundary changes, billing, deployment,
or secret/access-control changes.
