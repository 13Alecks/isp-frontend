<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Next Scaffold — Agent Guide

This is an open-source Next.js starter for experienced developers who build
with AI agents. The conventions below are load-bearing: follow them so the
scaffold stays modular and consistent as features are added.

## What this scaffold is

A Next.js App Router project with **TanStack Query** for server state,
**Axios** for HTTP, and **NextAuth** (credentials) for auth. The codebase is
split into two top-level worlds:

- **`app/`** — Next.js routing primitives only. Routes, layouts, route
  handlers. Thin by design.
- **`src/`** — everything else: features, shared infra, providers, config,
  utils.

The core rule: **`app/` routes delegate to `src/features/`; they do not
implement.** Implementation lives in feature modules.

## Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server. |
| `npm run build` | Build the production app. |
| `npm run lint` | Run ESLint — includes import-boundary enforcement (see below). |
| `npx tsc --noEmit` | Typecheck without emitting. |
| `npx shadcn@latest add <component>` | Add a shadcn/ui primitive to `src/shared/components/ui/`. |

## Folder structure

```
app/                  # Next.js App Router — routing only, stays thin
├── layout.tsx        # Root layout, wraps children in <Providers>
├── page.tsx          # Home route
├── globals.css
└── api/              # Route handlers
src/
├── features/         # Vertical feature slices        → src/features/AGENTS.md
├── shared/           # Cross-feature UI, types, css    → src/shared/AGENTS.md
├── providers/        # App-wide React providers        → src/providers/AGENTS.md
├── config/           # Client/SDK configuration        → src/config/AGENTS.md
└── utils/            # Constants and reusable helpers  → src/utils/AGENTS.md
proxy.ts                  # Edge route guard (NextAuth token check, Next.js 16 proxy)
```

Each `src/` subfolder has its own `AGENTS.md` with the detailed rules for that
layer. **Read the relevant one before writing code in that layer.**

## How pages are implemented and called from features

This is the most important convention in the scaffold. Get it right.

### The split

- **`app/<route>/page.tsx`** is the Next.js entry point. It must stay thin:
  set metadata, choose server vs. client, and **render a feature page
  component**. No business logic, no data fetching, no substantial JSX.
- **`src/features/<feature>/pages/`** holds the actual page implementation —
  the composition of the feature's `components/`, `hooks/`, and `api/` hooks
  that produces the screen the user sees.

### The pattern

A route file imports a page component from its feature and renders it:

```tsx
// app/login/page.tsx — thin route entry
import { LoginPage } from "@/features/auth/pages";

export default function Page() {
  return <LoginPage />;
}
```

```tsx
// src/features/auth/pages/login-page.tsx — the real implementation
"use client";

import { LoginForm } from "@/features/auth/components";
import { useLogin } from "@/features/auth/api";

export function LoginPage() {
  const login = useLogin();
  return <LoginForm onSubmit={login.mutate} isLoading={login.isPending} />;
}
```

### Rules

- **Routes compose, features implement.** If you are writing data fetching,
  state, or more than a few lines of JSX in `app/`, stop and move it into the
  feature's `pages/` (and from there into `components/`/`hooks/` as needed).
- **One route → one feature page.** A route maps to a single page component
  exported from the owning feature. Don't inline multiple features' UI in one
  route file; if a screen spans features, pick the owning feature and have it
  import the others through their public barrels.
- **Server/client boundary lives in the route.** Decide `"use client"` at the
  route or feature-page level. Keep server-only work (cookies, direct DB) in
  the route handler or a server component, and pass props down to client
  feature components.
- **Route handlers (`app/api/...`) follow the same idea.** They wire Next.js
  request/response to feature logic and stay thin wrappers.

## Layers and dependency direction

Dependencies flow inward and downward. Never reach sideways or upward.

```
app/ routes  →  features/<feature>/pages  →  components  →  hooks + api  →  types + @/shared
```

- `features/` may import from `@/shared`, `@/config`, `@/providers`, `@/utils`,
  and its own internals.
- `features/` may **not** import from `app/`, and one feature may not reach
  into another feature's private files (use the other feature's public barrel
  only).
- `@/shared`, `@/config`, `@/providers`, `@/utils` are leaf layers — they do
  not import from `features/` or `app/`.

**These rules are enforced by ESLint.** `npm run lint` will fail on violations.
The `no-restricted-imports` rule blocks leaf layers from importing upward, and
blocks `app/` from importing feature internals (`components/`, `hooks/`, `api/`)
directly — only feature `pages/` are allowed. Do not disable or bypass these
rules.

## Anti-patterns

Common mistakes AI agents make. **Do not do any of these.**

### Don't fetch data in `app/` route files

```tsx
// ❌ app/users/page.tsx — WRONG
import { useUsers } from "@/features/users/api";

export default function Page() {
  const { data } = useUsers(); // data fetching + hooks in a route
  return <ul>{data?.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}
```

```tsx
// ✅ app/users/page.tsx — correct, thin route
import { UsersPage } from "@/features/users/pages";

export default function Page() {
  return <UsersPage />;
}
```

### Don't create nested feature folders for sub-routes

```tsx
// ❌ src/features/user/details/ — WRONG, nested feature module
// ❌ src/features/details/     — WRONG, separate top-level feature
```

```tsx
// ✅ src/features/user/pages/details-page.tsx — correct, one module per domain
//    app/user/details/page.tsx renders @/features/user/pages
```

### Don't import `@/features` inside `@/shared`

```tsx
// ❌ src/shared/components/ui/user-card.tsx — WRONG
import { useUser } from "@/features/auth/api"; // leaf layer reaching upward
```

```tsx
// ✅ Move the component to the feature, or pass data via props from the
//    feature's page/component that consumes the shared UI primitive.
```

### Don't import feature internals from `app/`

```tsx
// ❌ app/login/page.tsx — WRONG
import { LoginForm } from "@/features/auth/components"; // internals, not pages
```

```tsx
// ✅ app/login/page.tsx — correct
import { LoginPage } from "@/features/auth/pages"; // feature page only
```

### Don't hand-roll UI primitives that shadcn provides

```tsx
// ❌ src/features/auth/components/login-form.tsx — WRONG
<button className="px-4 py-2 bg-blue-500 text-white rounded">Submit</button>
```

```tsx
// ✅ Use shadcn — run `npx shadcn@latest add button` if not already added,
//    then import from @/shared/components/ui
import { Button } from "@/shared/components/ui";
```

### Don't put data hooks in `hooks/`

```tsx
// ❌ src/features/users/hooks/use-users.ts — WRONG, data hook in hooks/
export function useUsers() {
  return useQuery({ queryKey: ["users"], queryFn: fetchUsers });
}
```

```tsx
// ✅ src/features/users/api/index.ts — correct, data hooks go in api/
export function useUsers() {
  return useQuery({ queryKey: ["users"], queryFn: fetchUsers });
}
```

## Per-layer guides

Before writing code in a layer, read its guide:

- **`src/features/AGENTS.md`** — feature module shape, sub-routes, the active
  `components/` folder, the step-by-step recipe for adding a feature.
- **`src/shared/AGENTS.md`** — UI primitives, layout components, global types,
  custom CSS.
- **`src/providers/AGENTS.md`** — app-wide React context providers, the
  composition root, adding a new provider.
- **`src/config/AGENTS.md`** — client/SDK wiring (Axios instance, env-driven
  setup).
- **`src/utils/AGENTS.md`** — constants, reusable pure functions, what does
  not belong here.

## Before you write code

1. Read the relevant Next.js guide in `node_modules/next/dist/docs/` — this
   Next.js version may differ from what you know.
2. Read the `AGENTS.md` for the layer you are working in (see "Per-layer
   guides" above).
3. Mimic the closest existing module (`src/features/auth/`) rather than
   inventing a new shape.
