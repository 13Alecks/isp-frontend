# Providers

`src/providers/` holds the app-wide React context providers that wrap the
component tree. These are wired once in the root layout and inherited by
every route.

> Providers configure **cross-cutting runtime context** (query cache, auth
> session, theme, toast) — not feature state. If only one feature needs it, it
> is not an app provider.

## What lives here

- **One file per provider.** Each provider is a self-contained client
  component: `query-provider.tsx` (TanStack Query `QueryClient` + defaults),
  a future `theme-provider.tsx`, `toast-provider.tsx`, etc.
- **`app-providers.tsx`** — the composition root. It nests every provider in
  the correct order and exports a single `<Providers>` component. The root
  `app/layout.tsx` wraps `{children}` in `<Providers>` and nothing else
  provider-related.
- **`index.ts`** — barrel re-exporting `Providers` so the layout imports from
  `@/providers`, not a deep path.

## Rules

- **Every file is `"use client"`.** Providers rely on React context and hooks;
  they cannot be server components.
- **Configure defaults here, not at call sites.** Provider-wide options
  (QueryClient `staleTime`, `refetchOnWindowFocus`, theme defaults) are set
  once inside the provider. Consumers should not re-declare them.
- **Order matters in `app-providers.tsx`.** Nest providers so each one can
  read what it depends on — e.g. a toast provider that uses the query cache
  goes inside `ReactQueryProvider`. Keep the most fundamental outermost.
- **No feature imports.** Providers are a leaf layer — they depend on
  libraries and `@/config` only, never on `@/features`, `@/shared/components`,
  or `app/`.
- **No business logic.** A provider sets up context and renders children. It
  does not implement feature behavior.
- **Kebab-case filenames, PascalCase exports.** `query-provider.tsx` →
  `ReactQueryProvider`; `app-providers.tsx` → `Providers`.

## Adding a provider

1. Create `<name>-provider.tsx` with the `"use client"` directive.
2. Construct the client/config (e.g. `QueryClient`) inside the component,
   typically via `useState` so it is stable across renders.
3. Render the library's provider component, passing `children` through.
4. Add it to `app-providers.tsx` in the correct nesting order.
5. No change to `index.ts` unless exposing a new hook — `Providers` stays the
   single export the layout consumes.
