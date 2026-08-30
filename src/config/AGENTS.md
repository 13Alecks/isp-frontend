# Config

`src/config/` holds application configuration — instances, clients, and
environment-driven setup. This is where framework/library clients are
constructed and tuned, not where they are used.

> Config holds the **wiring**; `@/shared`, `@/features`, and `@/utils` hold
> the **usage**. Keep config files small: create the client, set defaults,
> attach interceptors, export. Nothing else.

## What lives here

- **API clients** — e.g. `api-client.ts` constructs the Axios instance with
  `baseURL` from env (`API_BASE_URL` server-side, `NEXT_PUBLIC_API_BASE_URL`
  browser-side) and attaches request/response interceptors.
- **Third-party client setup** — any SDK or client that needs global
  configuration (analytics, feature-flag service, payment SDK, etc.).
- **Env-driven constants** — values read from `process.env` and shaped into a
  usable form, when they configure a client or service rather than acting as
  plain app constants (plain constants go in `@/utils`).

## Rules

- **One file per client/config.** `api-client.ts` for Axios, `auth-config.ts`
  for an auth client, etc. Do not bundle unrelated configs together.
- **Export the configured instance, not usage.** Config exports the client
  (`apiClient`); consumers (`@/shared/api`, features) call it. Config files
  do not make requests themselves.
- **No business logic, no UI.** Config files construct and tune clients only.
- **No feature imports.** Config is a leaf layer — it depends on libraries and
  env, never on `@/features`, `app/`, or `@/shared` components.
- **Read env at module load.** Resolve `process.env.*` at the top of the file
  so the client is configured once, not per-call. Use the correct prefix:
  `NEXT_PUBLIC_*` for browser-exposed values, plain vars for server-only.
