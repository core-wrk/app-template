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

Decided 2026-09-16: a proprietary, per-buyer EULA (effective 2026-09-01, governed by South
Carolina law). See [`LICENSE`](../LICENSE). Each purchaser may use the Software in unlimited
Applications, including client and employer work, but may not resell, redistribute, or
repackage the starter itself. This fits the no-account, single-download-link delivery model:
the license is scoped to the individual buyer rather than a team or seat count, so it needs no
license-key or account infrastructure to enforce.
