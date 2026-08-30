# Shared

`src/shared/` holds cross-feature infrastructure: UI primitives, layout
components, and global types. Everything here is **feature-agnostic** — it
depends on no feature and every feature may depend on it.

> If a piece of code is tied to one feature's domain, it does not belong here.
> Promote code to `@/shared` only when two or more features genuinely need it.

## Layout

```
src/shared/
├── components/
│   ├── ui/        # Generic UI primitives — button, card, input, dialog, etc.
│   └── layout/    # Shared layout components — app shell, sidebar, header, etc.
├── css/           # Custom global CSS — shared styles, resets, overrides
└── types/
    └── index.d.ts # Global types only — backend API response shapes, etc.
```

### `components/ui/`

Generic, presentational UI primitives. These components know nothing about
the application's domain — no feature hooks, no feature types, no business
logic. They accept props and render.

**This scaffold uses [shadcn/ui](https://ui.shadcn.com) as the default
component library.** Any UI primitive that shadcn supports (button, card,
input, dialog, dropdown, select, table, etc.) must be added via the shadcn
CLI rather than hand-rolled:

```bash
npx shadcn@latest add <component>
```

Components are generated directly into this folder (`src/shared/components/ui/`)
per the aliases in `components.json`. Do not edit the generated files' core
structure — extend them through props and composition instead. Only build a
custom component here when shadcn does not offer an equivalent.

- One component per file, kebab-case filenames (`button.tsx`, `card.tsx`,
  `text-input.tsx`). Exports stay PascalCase (`Button`, `Card`, `TextInput`).
- Components here may import only from `@/shared` (other `ui/` components,
  `types/`), `@/utils` (the `cn` helper), and external libraries. They must
  **not** import from `features/`, `app/`, or `@/config`.
- Re-export the public surface through `ui/index.ts` so consumers import via
  `@/shared/components/ui`, not deep paths. Update the barrel whenever a new
  component is added.
- Styling uses Tailwind v4 with the shadcn theme tokens defined in
  `app/globals.css`. Stay consistent with those tokens — do not hardcode
  colors or radii.

### `components/layout/`

Structural components that shape the app's chrome — app shell, sidebar,
header, footer, page containers, auth-gated layouts. These may consume
app-wide concerns (e.g. the session, providers) but still no feature-specific
logic.

- Same naming rules as `ui/`: kebab-case files, PascalCase exports
  (`app-shell.tsx` → `AppShell`).
- Layout components may compose `ui/` primitives and read global state
  (session, theme), but must not reach into a feature's internals.
- Re-export through `layout/index.ts`.

### `types/index.d.ts`

**Global types only**, in a single `index.d.ts` file. This is the home for
shapes that span the whole app — most notably the expected root response
envelope from the backend API, and any other cross-cutting types.

- Define the backend's standard response shape here (e.g. the wrapper every
  API call returns: status, message, data, error).
- Define other app-wide types here too: shared enums, common DTOs that
  multiple features consume.
- Use `declare module` augmentations here only if they are truly global (not
  feature-scoped — feature augmentations like NextAuth session shaping stay
  in `features/<feature>/types/`).
- **Do not** put feature-specific types here. If only one feature uses a type,
  it belongs in that feature's `types/`.
- Keep everything in `index.d.ts`. Do not split global types across multiple
  files unless the file becomes unwieldy.

### `css/`

Custom CSS that needs to be shared across the app lives here — global styles,
resets, design-token definitions, utility-class overrides, animations, and any
hand-written CSS that is not covered by the project's primary styling tool
(e.g. Tailwind).

- **One concern per file.** `reset.css`, `animations.css`, `variables.css`.
  Do not dump everything into a single stylesheet.
- **Import once at the root.** Global CSS files are imported in
  `app/globals.css` or `app/layout.tsx`, not per-component. Feature and
  component-scoped styles stay co-located with their component; only
  app-wide CSS goes here.
- **No feature-specific styles.** If a stylesheet only serves one feature, it
  belongs in that feature's folder, not here.
- **Kebab-case filenames.** `form-overrides.css`, `scrollbar.css`.

## Rules

- **No feature imports.** Nothing in `@/shared` may import from
  `@/features/*` or `app/`. The dependency direction is one-way: features
  depend on shared, never the reverse.
- **No business logic.** `ui/` components are presentational. `layout/`
  components structure the page. Neither implements feature behavior.
- **Promote, don't duplicate.** When the same component or type appears in two
  features, move it here. When only one feature uses it, keep it there.
- **Barrel exports.** Each subfolder ships an `index.ts` (or `index.d.ts`) so
  imports stay shallow: `@/shared/components/ui`, `@/shared/types`.
