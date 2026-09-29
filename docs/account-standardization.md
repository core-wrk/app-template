# Core Wrk account standardization

Use one Core Wrk account, organization, or workspace per service, then create isolated
resources for each application underneath it. A new app generally does not need a new
vendor account.

## Standard operating model

| Service     | Shared Core Wrk parent            | Separate resource per application                    |
| ----------- | --------------------------------- | ---------------------------------------------------- |
| GitHub      | One Core Wrk organization         | One repository per app                               |
| Neon        | One Core Wrk organization/account | One Neon project per app                             |
| Render      | One Core Wrk workspace            | One project and API service per app                  |
| Cloudflare  | One Core Wrk account              | One Pages project, domain, and R2 bucket set per app |
| Better Auth | No vendor account                 | Auth code, secret, and database tables per app       |
| Lovable     | Existing account, if used         | Frontend export/sync per app                         |

The intended hierarchy is:

```text
Core Wrk
├── GitHub Organization
│   ├── corewrk-app-starter
│   ├── prototype-crm
│   └── client-portal
├── Neon Organization
│   ├── prototype-crm → main, dev, feature/preview branches
│   └── client-portal → main, dev, feature/preview branches
├── Render Workspace
│   ├── prototype-crm → API service
│   └── client-portal → API service
└── Cloudflare Account
    ├── prototype-crm → Pages project and domain
    ├── client-portal → Pages project and domain
    └── R2 → prototype-crm-files, client-portal-files
```

## Isolation rule

Shared vendor ownership does not mean shared application infrastructure. Do not share
databases, Better Auth secrets, storage buckets, or API services between unrelated apps.
Each generated application should have its own:

```text
Project:       corewrk/client-portal
API service:   corewrk-client-portal-api
Frontend:      corewrk-client-portal-web
Neon project:  client-portal
Storage:       corewrk-client-portal-files
Auth secret:   unique to this app
```

The names are a convention, not additional required environment variables. The starter
uses `DATABASE_URL` for the API's pooled connection and `DATABASE_URL_DIRECT` for direct
Drizzle migration access. A project may record the names above as provider metadata
alongside its deployment configuration.

Isolation keeps resets, access control, billing, migrations, and eventual transfer clear.
It also means one application's failure or credential rotation does not affect unrelated
applications.

## Ownership by stage

| Stage                  | Recommended account ownership                        |
| ---------------------- | ---------------------------------------------------- |
| Internal prototype     | Core Wrk accounts and resources                      |
| Core Wrk-owned product | Core Wrk accounts and resources permanently          |
| Client production app  | Prefer client-owned infrastructure before production |

Client work can begin in Core Wrk resources while the product is being developed. Before
production, provision the customer's database, cloud resources, and credentials in an
account they control, or agree explicitly that Core Wrk will operate it as a managed service.
This avoids unclear ownership and difficult transfers later.

## Creating a new app

The current local workflow is:

```bash
./scripts/create-project.sh client-portal
```

The script updates local project metadata, package names, title, and development ports.
It does not provision GitHub, Neon, Render, or Cloudflare resources. Those resources are
created under the shared Core Wrk parents using the naming convention above.

For Neon, name the project after the app. The starter itself does not need a permanent
production database; use a disposable sandbox project if validating the template. Keep
the project's `main` branch for production and its `dev` branch for synthetic data. Use
project-scoped API keys for coding agents rather than organization-wide keys.

Future automation may extend this workflow to provision a repository, database, API
service, frontend project, and storage bucket. Any such automation should preserve the
one-resource-set-per-app isolation rule.

## One-time Core Wrk setup

The account structure only needs to be created once:

1. Core Wrk GitHub organization
2. Core Wrk Neon organization/account
3. Core Wrk Render workspace
4. Core Wrk Cloudflare account
5. Lovable account, if the team continues to use it for UI prototyping

Each new application then becomes a new resource set under those parents rather than a
new registration and password-management problem.

## Related provider references

These links describe the provider structures behind the standard:

- [GitHub organizations](https://docs.github.com/en/organizations/collaborating-with-groups-in-organizations/about-organizations)
- [Neon project creation](https://api-docs.neon.tech/reference/createproject)
- [Render workspace plans](https://render.com/docs/new-workspace-plans)
- [Cloudflare R2](https://developers.cloudflare.com/r2/get-started/)
- [Better Auth installation](https://better-auth.com/docs/installation)
