# Utils

`src/utils/` holds generic, domain-free helpers: constants, reusable
functions, and small utilities that any layer may need.

> Utils are **leaf helpers** — they depend on nothing project-internal, only
> on libraries and language primitives. If a helper needs a feature's types or
  a configured client, it has outgrown `utils/`.

## What lives here

- **Constants** — app-wide magic values that are not env-driven client config:
  route paths, query-key namespaces, storage keys, pagination defaults, etc.
- **Reusable functions** — pure, generic helpers used across features:
  formatters (dates, currency), validators (email, password rules), parsers
  (query strings, JWT payloads), small math/array/string utilities.
- **Tiny utilities** — anything small, stateless, and domain-free that two or
  more consumers would otherwise duplicate.

## What does NOT live here

- **API clients** → those live in `@/config`.
- **React components or hooks** → `@/shared/components` and feature `hooks/`.
- **Feature-specific logic** → the feature's own `hooks/` or `api/`.
- **Types** → global types in `@/shared/types`, feature types in the feature's
  `types/`.

## Rules

- **Pure and stateless.** Utils take inputs and return outputs. No singletons,
  no side effects, no React state. (A helper that reads `localStorage` is
  fine; one that holds mutable module-level state is not.)
- **No project-internal imports.** Utils may import libraries and other utils
  only — never `@/features`, `@/config`, `@/shared/components`, or `app/`.
- **One concern per file.** Group related helpers in one file
  (`format.ts`, `validate.ts`, `constants.ts`). Do not create a single
  catch-all `helpers.ts`.
- **Kebab-case filenames.** `date-format.ts`, `query-keys.ts`. Exports stay
  camelCase (`formatDate`, `queryKeys`) unless exporting a constant
  (`API_ROUTES`).
