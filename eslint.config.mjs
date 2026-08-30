import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import importPlugin from "eslint-plugin-import";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),

  // ---------------------------------------------------------------------------
  // Import boundary enforcement
  //
  // Encodes the modularity rules from AGENTS.md as build failures so AI agents
  // cannot silently violate the scaffold's layering.
  //
  // Two mechanisms are used:
  //   1. `no-restricted-imports` (built-in) — blocks leaf layers from importing
  //      upward by import specifier pattern.
  //   2. `import/no-restricted-paths` (plugin) — zone-based, blocks app/ from
  //      reaching into feature internals (components/hooks/api) while allowing
  //      feature pages.
  // ---------------------------------------------------------------------------

  // TypeScript resolver for eslint-plugin-import (resolves @/* path aliases).
  {
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
  },

  // Leaf layers: block upward imports via no-restricted-imports.
  // @/shared — may not import features or app.
  {
    files: ["src/shared/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/features/*", "@/features", "app/*"],
              message:
                "@/shared is a leaf layer — it must not import from @/features or app/. See AGENTS.md.",
            },
          ],
        },
      ],
    },
  },
  // @/config — may not import features, shared components, or app.
  {
    files: ["src/config/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/features/*",
                "@/features",
                "@/shared/components/*",
                "app/*",
              ],
              message:
                "@/config is a leaf layer — it must not import from @/features, @/shared/components, or app/. See AGENTS.md.",
            },
          ],
        },
      ],
    },
  },
  // @/utils — may not import features, config, shared components, or app.
  {
    files: ["src/utils/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/features/*",
                "@/features",
                "@/config/*",
                "@/shared/components/*",
                "app/*",
              ],
              message:
                "@/utils is a leaf layer — it must not import from @/features, @/config, @/shared/components, or app/. See AGENTS.md.",
            },
          ],
        },
      ],
    },
  },
  // @/providers — may not import features, shared components, or app.
  {
    files: ["src/providers/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/features/*",
                "@/features",
                "@/shared/components/*",
                "app/*",
              ],
              message:
                "@/providers is a leaf layer — it must not import from @/features, @/shared/components, or app/. See AGENTS.md.",
            },
          ],
        },
      ],
    },
  },

  // app/ — may only import feature pages, not feature internals.
  // Enforces "routes delegate to feature pages".
  {
    files: ["app/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/features/*/components",
                "@/features/*/components/*",
                "@/features/*/hooks",
                "@/features/*/hooks/*",
                "@/features/*/api",
                "@/features/*/api/*",
              ],
              message:
                "app/ routes must import from feature pages (@/features/<feature>/pages), not feature internals. See AGENTS.md.",
              allowTypeImports: true,
            },
          ],
        },
      ],
    },
  },
  // features/ — may not import from app/.
  {
    files: ["src/features/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["app/*"],
              message:
                "features/ must not import from app/. Routes delegate to features, never the reverse. See AGENTS.md.",
              allowTypeImports: true,
            },
          ],
        },
      ],
    },
  },

  // Zone-based rules via import/no-restricted-paths (file-path level).
  // These complement the import-specifier rules above by catching relative
  // path imports that bypass the @/ alias.
  {
    plugins: { import: importPlugin },
    rules: {
      "import/no-restricted-paths": [
        "error",
        {
          basePath: ".",
          zones: [
            // features/ may not import from app/ (catches relative imports).
            {
              target: "./src/features",
              from: "./app",
              message:
                "features/ must not import from app/. Routes delegate to features, never the reverse. See AGENTS.md.",
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
