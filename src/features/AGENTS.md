# Feature Modules

`src/features/` is the home of vertical feature slices. Each subfolder is a
**self-contained module** that owns everything a feature needs: its data layer,
its UI, its hooks, its types, and its page compositions.

> Modularity is the rule. A feature must be consumable as a single unit and
> must not leak its internals upward. Cross-feature talk goes through clearly
> exported boundaries, never through deep imports into another feature's
> private files.

## Module layout

Every feature module follows the same shape. Keep it consistent so any agent
can navigate a feature without reading it first.

```
src/features/<feature>/
├── api/          # Server communication + React Query hooks
├── components/   # Feature-scoped UI components (ACTIVE — see below)
├── hooks/        # Non-data hooks (state, effects, helpers)
├── pages/        # Page-level compositions — one file per route in this feature
├── types/        # TypeScript types and module augmentations
└── index.ts      # Optional: public barrel re-exporting the module's API
```

## Sub-routes share one module

A feature owns **all of its sub-routes**. A domain like `user` with routes
`/user` and `/user/details` is **one feature module**, not a parent with
nested feature folders. The sub-routes share a single `api/`, `components/`,
`hooks/`, and `types/`; only `pages/` holds one composition per route.

```
src/features/user/
├── api/            # shared by /user and /user/details
├── components/     # shared — user-profile.tsx, user-details-form.tsx, etc.
├── hooks/          # shared
├── pages/
│   ├── user-page.tsx        # composed by app/user/page.tsx
│   └── details-page.tsx     # composed by app/user/details/page.tsx
├── types/          # shared
└── index.ts
```

Rules:

- **One feature per domain, however many routes.** `/user` and
  `/user/details` both live in `features/user/`. Do not create
  `features/user/details/` as a separate module.
- **`pages/` is the only place sub-routes diverge.** Add one page file per
  route. They all import from the same shared `components/`, `hooks/`, `api/`.
- **Routes mirror the feature, not the folder depth.** `app/user/page.tsx`
  renders `@/features/user/pages` (the `user-page`), and
  `app/user/details/page.tsx` renders `@/features/user/pages` (the
  `details-page`). The `app/` route tree can nest; the `features/` module
  stays flat.
- **Split a feature only when the domain truly separates.** If `details`
  grows into its own data layer, types, and components that have nothing to
  do with `user`, then it has become its own feature — promote it to
  `src/features/details/`. Until then, keep it inside `user/`.

### `api/`

- Houses the data layer: raw request functions and the React Query hooks that
  wrap them (`useQuery` / `useMutation`).
- Calls the configured client **directly**: `import { apiClient } from "@/config/api-client"`.
  There is no shared `requestApi` wrapper — the feature's `api/` folder invokes
  `apiClient` (the Axios instance) itself and shapes the response.
- Hooks are the only thing other layers should import from here. Do not export
  raw fetchers unless they are genuinely reusable.
- Reference shape: `auth/api/index.ts` (currently a bare barrel on `base`; the
  `authenication` branch shows a filled-in example with `useLogin`/`useUser`).

#### Example: a complete data layer

```ts
// src/features/users/api/index.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/config/api-client";
import type { User, UserPayload } from "@/features/users/types";

// --- Raw fetchers (private, not exported) ---

async function fetchUsers(): Promise<User[]> {
  const { data } = await apiClient.get<{ data: User[] }>("/users");
  return data.data;
}

async function createUser(payload: UserPayload): Promise<User> {
  const { data } = await apiClient.post<{ data: User }>("/users", payload);
  return data.data;
}

// --- React Query hooks (exported, consumed by components/pages) ---

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
```

Key points to follow:
- Raw fetchers are **private** (not exported). Only the React Query hooks are
  exported.
- Fetchers call `apiClient` directly and destructure the response — shape it
  to return the domain type, not the raw Axios response.
- Query keys are plain arrays (`["users"]`). If a query takes params, include
  them in the key (`["users", userId]`).
- Mutations invalidate affected queries in `onSuccess` so cached data stays
  fresh.

### `components/` (ACTIVE)

This folder is **not a placeholder**. It is where the feature's UI lives and is
the primary surface other layers consume.

- Build the feature's UI here — forms, cards, lists, dialogs, widgets — rather
  than inlining JSX inside `app/` routes or `pages/` compositions.
- Prefer many small, single-purpose components over one large file. One
  component per file, named in kebab-case (`login-form.tsx`,
  `user-profile.tsx`). The exported component stays PascalCase
  (`LoginForm`, `UserProfile`); only the filename is kebab-case.
- Co-locate styles, sub-components, and tests next to the component that owns
  them. Keep private helpers private; export only what the rest of the app
  needs via `index.ts`.
- Components may import from `api/` (via hooks), `hooks/`, `types/`, and
  `@/shared`. They must **not** import from another feature's internals.
- Generic, feature-agnostic UI belongs in `@/shared` (or a future
  `@/shared/ui`), not here. If a component stops referencing this feature's
  data/hooks/types, it has outgrown this folder — move it up.

### `hooks/`

- Custom hooks that are not about data fetching (e.g. local state machines,
  debounced values, DOM effects, feature-specific business logic).
- Keep data hooks in `api/`; everything else goes here.
- Export through `index.ts`.

### `pages/`

- Page-level compositions that wire the feature's components and hooks together
  for a route. These are consumed by the Next.js `app/` router (or route
  handlers) — the `app/` directory stays thin and delegates here.
- **One page file per route the feature owns.** A feature with multiple
  sub-routes (e.g. `/user` and `/user/details`) keeps all of them here, each
  importing from the same shared `components/`, `hooks/`, `api/`. See
  "Sub-routes share one module" above.
- A page file should mostly compose, not implement. If you are writing
  substantial UI or logic in a page, extract it into `components/` or `hooks/`.

### `types/`

- TypeScript types, interfaces, and `declare module` augmentations for the
  feature (e.g. `next-auth` session shaping in `auth/types/index.d.ts`).
- Use `.d.ts` for ambient/module augmentations, `.ts` for exported types.
- Other layers import types from here; never inline feature types elsewhere.

## Adding a new feature

1. **Scaffold the module** with the five folders above. Add an `index.ts`
   barrel to each subfolder so imports stay shallow
   (`@/features/<feature>/components`, not deep paths).
2. **Start in `types/`** — define the domain shapes and any module
   augmentations first. Everything else depends on them.
3. **Build the data layer in `api/`** — add request functions and wrap them in
   React Query hooks. Call `apiClient` from `@/config/api-client` directly; do
   not spin up a second HTTP client.
4. **Build the UI in `components/`** — this is the active layer. Create
   focused components that consume the `api/` hooks and `types/`. Do not leave
   this folder empty or unused; if the feature has a user-facing surface, it
   lives here.
5. **Add non-data hooks in `hooks/`** only if you need them.
6. **Compose pages in `pages/`** that assemble the components for routing, then
   keep the corresponding `app/` route thin.
7. **Export the public API** via `index.ts` at the module root if the feature
   is consumed from outside.

## Modularity rules

- **No cross-feature deep imports.** Feature A may only use Feature B's
  exported barrel, never `@/features/b/components/InternalWidget`.
- **Dependencies flow inward and downward:** `pages/` → `components/` →
  `hooks/` + `api/` → `types/` + `@/shared`. `types/` and `@/shared` depend on
  nothing feature-internal.
- **Shared code goes to `@/shared`.** If two features need it, it is not a
  feature — promote it.
- **One concern per folder.** Don't put data hooks in `hooks/`, don't put UI in
  `pages/`, don't put types in `api/`.
- **Keep `app/` thin.** Routes delegate to feature `pages/`; they do not
  implement feature logic.
