# Commercialization

The starter is intentionally generic so Core Wrk can package it without carrying private
client information or customer-specific behavior.

Possible product paths are an internal consulting accelerator, a paid source starter kit,
an implementation package, a managed prototype service, or later vertical editions such as
client portal, internal operations, analytics, AI, or healthcare-safe variants.

Keep optional capabilities additive. Billing, email, jobs, organizations, roles, audit logs,
analytics, admin tools, webhooks, uploads, and feature flags are deliberately not included in
the core until a real project needs them.

White-label application metadata lives in `packages/shared/src/config/branding.ts`. A project
creation run can update its application name and title without introducing a theme system.
Do not put credentials, client names, or private integrations in this repository.

Use [account-standardization.md](account-standardization.md) when provisioning apps. Core Wrk
can centrally manage the vendor accounts while isolating each customer's database, API,
frontend, storage, and auth secret. For client production work, prefer moving those resources
into accounts the customer controls before launch, unless Core Wrk is explicitly providing a
managed service.

## Licensing

The starter is available under the [Apache License 2.0](../LICENSE). Developers can
use, modify, and redistribute it, including for commercial projects, under those terms.
