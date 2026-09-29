# Core Wrk App Starter — Build Specification

## Purpose

Create a reusable, production-capable starter repository for rapidly prototyping and building modern web applications with AI coding agents such as Claude Code and Codex.

The starter must optimize for:

1. Fast prototyping with minimal infrastructure ceremony.
2. Full code ownership in GitHub.
3. Direct editability by coding agents across frontend, backend, database, auth, tests, and deployment configuration.
4. Near-zero or very low prototype hosting cost.
5. A clean path from prototype to production without a major rewrite or platform migration.
6. Low architectural complexity suitable for early-stage products, internal tools, MVPs, and client prototypes.
7. Reusability across multiple projects.
8. Potential commercialization by Core Wrk as a consulting accelerator, starter kit, template, or managed implementation offering.

The starter should be intentionally boring, portable, explicit, and easy to reason about.

---

# 1. Product Principles

## 1.1 Core philosophy

The starter is not a framework experiment.

It is an opinionated application template designed to reduce setup time and prevent over-engineering.

Default architecture:

- one frontend
- one API service
- one PostgreSQL database
- one authentication system
- one object-storage abstraction
- one monorepo
- one deployment path per environment

Do not introduce architectural complexity unless an explicit product requirement requires it.

## 1.2 Source of truth

GitHub is the source of truth for application behavior and infrastructure configuration.

All important application state must be represented in code where practical, including:

- database schema
- migrations
- API routes
- business logic
- authentication configuration
- validation rules
- environment-variable contracts
- deployment configuration
- tests
- developer setup

Hosted dashboards may be used for provisioning and observability, but should not become the only place where application behavior is defined.

## 1.3 Portability principle

The application must remain portable between low-cost prototype infrastructure and production infrastructure.

Prototype target:

- frontend: Cloudflare Pages
- API: Render Free or equivalent low-cost Node container host
- database: Neon PostgreSQL
- auth: Better Auth
- object storage: Cloudflare R2 or compatible S3-style provider

Production target:

- frontend: Cloudflare Pages or equivalent static hosting
- API: Google Cloud Run
- database: Neon PostgreSQL or Google Cloud SQL PostgreSQL
- auth: same Better Auth implementation
- object storage: Cloudflare R2 or Google Cloud Storage

The application code should not require meaningful rewrites when moving between these environments.

---

# 2. Standard Technology Stack

Use the following stack unless there is a documented reason not to.

## Frontend

- React
- Vite
- TypeScript
- Tailwind CSS
- React Router
- TanStack Query for server-state management
- Zod for shared validation

The frontend should remain compatible with Lovable-generated React/Vite projects wherever practical.

## Backend API

- TypeScript
- Node.js 22+
- Hono
- REST API under `/api`
- Zod request/response validation
- structured service layer for business logic

Avoid framework-specific server runtimes that make later migration difficult.

## Database

- PostgreSQL
- Drizzle ORM
- Drizzle Kit migrations
- Neon for prototype environments
- Cloud SQL PostgreSQL supported as a production destination

Database schema and migration history must live in Git.

## Authentication

- Better Auth
- Drizzle database adapter
- secure cookie-based sessions by default
- email/password capability optional
- OAuth-ready architecture

Do not tightly couple authentication to a hosting provider.

## Object Storage

Provide a thin storage abstraction with adapters for:

- Cloudflare R2
- Google Cloud Storage
- local development storage where practical

Do not expose provider-specific storage logic throughout the application.

## Testing

- Vitest
- React Testing Library
- Supertest or Hono-compatible HTTP testing utilities
- Playwright for optional end-to-end testing

## Code Quality

- ESLint
- Prettier
- TypeScript strict mode
- Husky optional, not required
- lint-staged optional, not required

Do not add tooling that creates unnecessary developer friction.

## Package Management

- pnpm
- pnpm workspaces

## Local Development

- Docker Compose for infrastructure dependencies only where useful
- local Node execution for frontend and API by default
- `.env.local` or equivalent untracked environment files

Avoid forcing Docker for normal frontend/backend development.

---

# 3. Repository Structure

Create a monorepo using the following structure:

```text
core-wrk-app-starter/
├── apps/
│   ├── web/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── features/
│   │   │   ├── hooks/
│   │   │   ├── lib/
│   │   │   ├── pages/
│   │   │   ├── routes/
│   │   │   └── styles/
│   │   ├── public/
│   │   ├── index.html
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   └── api/
│       ├── src/
│       │   ├── auth/
│       │   ├── config/
│       │   ├── middleware/
│       │   ├── routes/
│       │   ├── services/
│       │   ├── jobs/
│       │   ├── lib/
│       │   └── index.ts
│       ├── Dockerfile
│       └── package.json
│
├── packages/
│   ├── db/
│   │   ├── src/
│   │   │   ├── client.ts
│   │   │   ├── schema/
│   │   │   ├── migrations/
│   │   │   └── seed/
│   │   └── package.json
│   │
│   ├── shared/
│   │   ├── src/
│   │   │   ├── constants/
│   │   │   ├── schemas/
│   │   │   ├── types/
│   │   │   └── utils/
│   │   └── package.json
│   │
│   └── config/
│       ├── eslint/
│       ├── typescript/
│       └── package.json
│
├── docs/
│   ├── architecture.md
│   ├── local-development.md
│   ├── deployment.md
│   ├── prototype-to-production.md
│   └── commercialization.md
│
├── scripts/
│   ├── bootstrap.sh
│   ├── verify.sh
│   ├── reset-local.sh
│   └── create-project.sh
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── optional-deploy.yml
│
├── AGENTS.md
├── CLAUDE.md
├── CODEX.md
├── README.md
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── docker-compose.yml
├── drizzle.config.ts
├── .env.example
├── .gitignore
└── LICENSE
```

Keep the structure simple. Do not add packages merely to create theoretical separation.

---

# 4. Required Starter Functionality

The starter must run as a functioning reference application immediately after setup.

Include a simple example domain such as `projects`.

## Required example functionality

### Public

- landing page
- sign-in page
- health/status page

### Authenticated

- dashboard
- create project
- list projects
- view project
- edit project
- delete project

### Authentication

- session support
- protected frontend routes
- protected API routes
- logout

### API

Implement at minimum:

```text
GET    /api/health
GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PATCH  /api/projects/:id
DELETE /api/projects/:id
```

### Database

Include tables sufficient for:

- users
- sessions/accounts required by Better Auth
- projects

Use timestamps and UUIDs consistently.

---

# 5. Frontend Architecture Rules

The frontend should be straightforward for both Lovable and coding agents to modify.

## Rules

1. Prefer feature-oriented components over excessive abstraction.
2. Keep API access centralized in `apps/web/src/lib/api`.
3. Use TanStack Query for remote data.
4. Use React local state for local interaction state.
5. Do not add Redux unless explicitly required.
6. Do not introduce a generated SDK unless the project materially benefits from one.
7. Keep shared validation schemas in `packages/shared` where useful.
8. Frontend must communicate with the backend through HTTP APIs rather than direct database access.
9. Do not import backend-only code into the browser bundle.
10. Keep environment-specific frontend configuration minimal.

## API client convention

Create a simple typed API client wrapper.

Example conceptual structure:

```text
apps/web/src/lib/api/
├── client.ts
├── projects.ts
└── auth.ts
```

Avoid unnecessary client abstractions.

---

# 6. Backend Architecture Rules

Use Hono as the HTTP layer.

Structure routes by feature/domain.

Example:

```text
apps/api/src/routes/
├── health.ts
├── auth.ts
└── projects.ts
```

Business logic belongs in services when logic is more than trivial CRUD.

Example:

```text
apps/api/src/services/
└── project-service.ts
```

## Rules

1. Route handlers should remain thin.
2. Validate external input with Zod.
3. Return consistent JSON error shapes.
4. Keep business logic independent of Hono where practical.
5. Do not introduce repository classes unless complexity justifies them.
6. Do not introduce dependency injection containers.
7. Do not introduce event buses for ordinary workflows.
8. Do not create microservices.
9. Keep background jobs in the same codebase until scaling requirements justify separation.
10. Prefer synchronous flows for prototypes unless async processing is clearly required.

---

# 7. Database Standards

The database schema must be treated as code.

## Requirements

- all schema definitions in Drizzle
- all schema changes via migrations
- no manual production schema edits without a migration
- seed utilities included
- clear local reset workflow
- database URL supplied through environment variable
- no provider-specific database APIs in core application logic

## Environment variables

Use:

```text
DATABASE_URL=
```

The same application must support:

- local PostgreSQL
- Neon
- Cloud SQL
- standard PostgreSQL-compatible providers

---

# 8. Authentication Standards

Use Better Auth.

## Requirements

- Better Auth configuration lives in repo
- Drizzle adapter
- authentication tables managed through the project schema/migrations workflow where possible
- secure cookies in production
- explicit trusted-origin configuration
- frontend helper functions
- backend route protection middleware

Do not build application authorization logic directly into the authentication provider.

Keep authorization decisions in application code.

Provide a clean extension point for future:

- Google OAuth
- GitHub OAuth
- magic links
- organizations/workspaces
- roles

Do not implement all of these by default.

---

# 9. Environment Model

Support three logical environments:

```text
local
preview
production
```

## Local

- local frontend
- local API
- local PostgreSQL via Docker Compose OR Neon development branch
- local environment file

## Preview

- Cloudflare Pages preview deployment
- Render service or equivalent
- Neon preview/dev branch where appropriate

## Production

- Cloudflare Pages or equivalent
- Cloud Run
- Neon or Cloud SQL
- managed object storage

Keep differences configuration-based rather than code-based.

---

# 10. Deployment Design

## Prototype deployment

### Frontend

Cloudflare Pages.

### API

Render using the repository Dockerfile.

The API Dockerfile must also work on Google Cloud Run without modification wherever possible.

### Database

Neon PostgreSQL.

### Storage

Cloudflare R2 if needed.

## Production deployment

Provide documented migration steps for:

```text
Render -> Google Cloud Run
Neon -> Neon paid OR Cloud SQL
R2 -> R2 OR Google Cloud Storage
```

The goal is infrastructure substitution, not application rewriting.

---

# 11. Docker Requirements

The API must include a minimal production Dockerfile.

Requirements:

- Node 22 base image
- deterministic pnpm install
- production build
- non-root runtime where practical
- port configurable through `PORT`
- compatible with Cloud Run
- no embedded secrets

Do not containerize the frontend unless needed for a specific deployment target.

---

# 12. Local Development Experience

A new developer or coding agent must be able to run the application with minimal setup.

Target workflow:

```bash
pnpm install
cp .env.example .env.local
pnpm db:up
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Provide top-level commands for:

```text
pnpm dev
pnpm build
pnpm test
pnpm lint
pnpm typecheck
pnpm verify
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm db:reset
```

`pnpm verify` should run the minimum useful validation suite:

- typecheck
- lint
- unit tests
- build

Avoid adding expensive or redundant validation steps to ordinary development.

---

# 13. AI Agent Operating Rules

Create `AGENTS.md`, `CLAUDE.md`, and `CODEX.md`.

All should reinforce the same engineering philosophy.

## Core agent directive

This starter is optimized for early-stage product development and rapid iteration.

Agents must prefer the smallest practical implementation that satisfies the requirement.

## Mandatory architecture constraints

Agents must not introduce the following unless a specific requirement makes them necessary:

- microservices
- Kubernetes
- event-driven architecture
- message queues
- CQRS
- event sourcing
- service meshes
- multiple databases
- speculative caching layers
- repository patterns for trivial CRUD
- dependency-injection containers
- excessive interface abstraction
- custom framework development
- infrastructure-as-code platforms for trivial prototype resources
- multi-region architecture
- premature observability stacks
- speculative scalability work

## Default decision hierarchy

When choosing an implementation, prefer in this order:

1. existing project pattern
2. simplest code change
3. existing dependency
4. standard platform capability
5. small new dependency
6. new abstraction
7. new service
8. new infrastructure

Agents must justify steps 6 through 8.

## Human approval minimization

Agents should execute low-risk, reversible development work autonomously.

Do not require manual approval for:

- normal code edits
- ordinary database migrations in development
- test updates
- refactoring inside existing architecture
- local build/lint/test execution

Human review is appropriate for:

- destructive production database changes
- authentication/security architecture changes
- irreversible external actions
- billing changes
- production infrastructure deletion
- secrets or access-control modifications

## Evidence requirements

Do not generate ceremonial validation packages.

Use the smallest evidence needed to establish that a change works.

For most feature work:

- relevant tests pass
- typecheck passes
- build passes
- feature behavior is verified

Do not produce screenshots, long audit reports, or duplicated test evidence unless explicitly requested.

---

# 14. Lovable Compatibility

The starter should be easy to use with Lovable as a visual frontend prototyping tool.

## Requirements

- `apps/web` must remain a conventional React/Vite application
- avoid unusual monorepo assumptions that break normal frontend tooling
- document how to import or merge a Lovable-generated frontend into `apps/web`
- document how to replace direct Supabase calls with the starter API client
- keep backend completely independent from Lovable

## Recommended workflow

```text
Lovable
   ↓
GitHub sync/export
   ↓
apps/web
   ↓
Claude Code / Codex
   ↓
full-stack implementation
```

Lovable must be optional.

The starter must remain fully usable without it.

---

# 15. Project Creation Workflow

Create a script:

```text
scripts/create-project.sh
```

The goal is to transform the starter into a new application with minimal manual work.

It should accept or prompt for:

- application name
- package namespace
- app title
- local API port
- local web port

It should update:

- package metadata
- README title
- environment defaults
- project identifiers

Do not make this script overly complex.

If GitHub CLI is installed, optionally support creating a new GitHub repository.

Example desired usage:

```bash
./scripts/create-project.sh my-new-app
```

---

# 16. Bootstrap Script

Create:

```text
scripts/bootstrap.sh
```

Responsibilities:

1. validate prerequisites
2. install dependencies
3. create missing local environment file
4. start local database if configured
5. run migrations
6. seed example data
7. print next-step instructions

The script should be idempotent where practical.

---

# 17. CI Requirements

Create a simple GitHub Actions workflow.

On pull requests and pushes to the main branch:

```text
install
→ typecheck
→ lint
→ test
→ build
```

Do not add complex deployment automation by default.

Provide deployment workflow examples separately or disabled until configured.

---

# 18. Documentation Requirements

## README.md

Must include:

- what the starter is
- architecture summary
- stack
- quick start
- environment configuration
- common commands
- deployment options
- how to create a new project
- Lovable integration notes
- agent workflow

## docs/architecture.md

Explain:

- major components
- data flow
- authentication flow
- API boundaries
- portability decisions

## docs/local-development.md

Explain:

- prerequisites
- local setup
- database workflow
- troubleshooting

## docs/deployment.md

Explain:

- Cloudflare Pages frontend
- Render prototype API
- Neon database
- Cloud Run production API
- optional Cloud SQL migration

## docs/prototype-to-production.md

Provide a concrete progression:

```text
Stage 0 — local experiment
Stage 1 — free hosted prototype
Stage 2 — private beta
Stage 3 — production hardening
Stage 4 — scale only when required
```

Describe what changes at each stage and, importantly, what does NOT need to change.

---

# 19. Commercialization Requirements

The repository should be designed so Core Wrk can potentially monetize it.

Do not hard-code private client information, credentials, or customer-specific logic.

## Productization paths

The starter should support future packaging as:

### Option A — Consulting accelerator

Core Wrk uses the starter internally to deliver MVPs and prototypes faster.

Customer receives the finished project, not necessarily the starter itself.

### Option B — Paid starter kit

Sell repository access, downloadable source, or a licensed template.

### Option C — Implementation package

Sell the starter plus setup/customization services.

### Option D — Managed prototype platform

Core Wrk provisions and configures the stack for clients.

### Option E — Vertical starter editions

Create variants such as:

- SaaS starter
- client portal starter
- internal operations tool starter
- analytics dashboard starter
- AI application starter
- healthcare-safe architecture starter

Do not build these variants now.

Design the core starter so they can be created later through optional modules.

---

# 20. Branding and White-Labeling

Core starter code should avoid unnecessary visible Core Wrk branding inside generated applications.

Keep branding isolated to:

```text
packages/shared/src/config/branding.ts
```

or an equivalent simple configuration file.

Support:

- application name
- application description
- logo path
- primary brand metadata

Do not build a complex theming system.

The repository itself may include Core Wrk attribution in documentation and licensing.

---

# 21. Licensing Decision

Do not automatically choose an open-source license without explicit owner approval.

During initial implementation:

Create `LICENSE` with a placeholder explaining that licensing is intentionally pending.

Suggested note:

```text
Copyright © Core Wrk. All rights reserved.

License terms for redistribution, resale, modification, or commercial use
will be defined before public distribution.
```

Before public launch, Core Wrk should choose between:

- proprietary commercial license
- dual license
- source-available commercial license
- permissive open-source core plus paid add-ons

Do not assume MIT is appropriate if commercialization is planned.

---

# 22. Optional Modules

The starter architecture should leave room for optional modules but must not implement them unless specifically requested.

Potential modules:

- Stripe billing
- email provider
- background jobs
- AI/LLM abstraction
- organizations/workspaces
- role-based access control
- audit logs
- analytics
- admin console
- webhooks
- file uploads
- feature flags

Optional modules should be additive.

The core starter must stay small.

---

# 23. Security Baseline

Implement a reasonable baseline without enterprise ceremony.

Required:

- secure cookie configuration
- environment-secret handling
- server-side authorization checks
- input validation
- CORS configuration
- basic security headers
- SQL injection protection through ORM parameterization
- password hashing delegated to the auth library
- no secrets committed to Git
- `.env.example` contains placeholders only

Do not add heavyweight security tooling by default.

---

# 24. Observability Baseline

For the starter:

- structured console logging
- request IDs where simple
- health endpoint
- clear startup errors

Do not add Datadog, OpenTelemetry collectors, Sentry, or external logging platforms by default.

Document them as optional production additions.

---

# 25. Performance Baseline

Do not prematurely optimize.

Default expectations:

- appropriate database indexes for common lookup keys
- pagination for potentially unbounded lists
- avoid N+1 queries
- reasonable frontend code splitting from Vite defaults
- no custom cache layer initially

---

# 26. Acceptance Criteria

The implementation is complete only when all of the following are true.

## Repository

- monorepo structure exists
- pnpm workspace works
- TypeScript strict mode enabled
- linting configured
- formatting configured

## Frontend

- React/Vite app starts
- landing page works
- authenticated dashboard works
- project CRUD UI works
- protected routes work

## Backend

- Hono API runs locally
- health endpoint works
- project CRUD endpoints work
- authentication middleware works
- API returns consistent errors

## Database

- Drizzle schema exists
- migrations can be generated
- migrations can be applied
- local reset works
- seed works

## Authentication

- Better Auth configured
- sign in works
- sign out works
- authenticated requests work
- protected routes reject unauthenticated access

## Testing

- unit tests included
- API integration tests included
- critical authentication flow tested
- `pnpm verify` passes

## Docker

- API image builds
- API container starts
- container can connect to PostgreSQL
- image is Cloud Run compatible

## Documentation

- README complete
- architecture documented
- local setup documented
- deployment documented
- prototype-to-production path documented

## Agents

- AGENTS.md exists
- CLAUDE.md exists
- CODEX.md exists
- all contain anti-overengineering guidance

## Commercialization

- licensing placeholder exists
- white-label configuration exists
- commercialization documentation exists

---

# 27. Implementation Sequence

Agents should implement in this order unless there is a strong reason to deviate.

## Phase 1 — repository foundation

- pnpm monorepo
- shared TypeScript config
- frontend skeleton
- API skeleton
- shared package
- DB package

## Phase 2 — database

- Drizzle configuration
- user/auth schema
- project schema
- migration workflow
- seed workflow

## Phase 3 — API

- health route
- project routes
- validation
- error handling
- services

## Phase 4 — authentication

- Better Auth backend
- frontend auth client
- protected API middleware
- protected frontend routes

## Phase 5 — frontend reference app

- landing
- login
- dashboard
- project CRUD

## Phase 6 — local tooling

- Docker Compose database
- bootstrap script
- reset script
- verification script

## Phase 7 — deployment

- API Dockerfile
- Render documentation/config
- Cloudflare Pages documentation
- Neon setup documentation
- Cloud Run migration documentation

## Phase 8 — agent guidance

- AGENTS.md
- CLAUDE.md
- CODEX.md

## Phase 9 — commercialization readiness

- branding config
- licensing placeholder
- commercialization docs
- project creation script

## Phase 10 — final verification

Run:

```bash
pnpm install
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm verify
```

Then verify the documented local setup from a clean clone if feasible.

---

# 28. Definition of Done

The starter is done when a developer or AI coding agent can:

1. clone the repository
2. bootstrap the environment
3. run the complete application locally
4. create an authenticated user session
5. perform project CRUD
6. modify a database field through a Drizzle migration
7. add a new API endpoint
8. consume it from the frontend
9. run verification successfully
10. deploy the frontend and API using documented low-cost prototype infrastructure
11. move the API to Cloud Run later without rewriting business logic
12. move PostgreSQL providers later by changing infrastructure and connection configuration rather than rewriting application logic
13. create a new application from the starter with minimal manual changes

---

# 29. Explicit Non-Goals

The starter is not intended to be:

- a Kubernetes platform
- an enterprise microservice framework
- a fully generic application framework
- a no-code backend
- a replacement for a mature production platform team
- a multi-cloud abstraction layer
- a universal design system
- a full SaaS billing framework

Its job is to make ordinary web applications fast to start, easy for agents to edit, inexpensive to prototype, and straightforward to harden into production.

---

# 30. Agent Execution Instruction

When given this document, the implementing agent should:

1. inspect the target repository
2. preserve useful existing work if present
3. build the architecture described here
4. make reasonable implementation decisions without unnecessary clarification
5. avoid introducing new infrastructure beyond this specification
6. keep implementation simple and idiomatic
7. verify the repository at the end
8. update documentation to reflect the actual final implementation
9. explicitly list any deviations from this specification and why they were necessary

If a requirement can be satisfied by a simpler implementation than initially considered, choose the simpler implementation.

The success metric is not architectural sophistication.

The success metric is a reusable starter that makes prototype-to-production application development fast, portable, agent-friendly, and commercially useful to Core Wrk.
