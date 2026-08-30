import {
  buttonVariants,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui";

/* -------------------------------------------------------------------------- */
/*  Icons — inline SVGs (no extra dependency)                                 */
/* -------------------------------------------------------------------------- */

function LayersIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
      <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
      <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function ZapIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
    </svg>
  );
}

function CodeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function FolderIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
    </svg>
  );
}

function GitBranchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="6" x2="6" y1="3" y2="15" />
      <circle cx="18" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M18 9a9 9 0 0 1-9 9" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function TerminalIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" x2="20" y1="19" y2="19" />
    </svg>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0z" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Data                                                                       */
/* -------------------------------------------------------------------------- */

const layers = [
  {
    icon: FolderIcon,
    name: "app/",
    desc: "Next.js routing only. Routes, layouts, route handlers. Thin by design — delegates to features.",
    badge: "Routing",
  },
  {
    icon: LayersIcon,
    name: "src/features/",
    desc: "Vertical feature slices. Each feature owns its api, components, hooks, pages, and types. Self-contained modules.",
    badge: "Core",
  },
  {
    icon: ShieldIcon,
    name: "src/shared/",
    desc: "Cross-feature UI primitives (shadcn/ui), layout components, global types, and custom CSS. Feature-agnostic.",
    badge: "Shared",
  },
  {
    icon: ZapIcon,
    name: "src/providers/",
    desc: "App-wide React context providers — TanStack Query, NextAuth session. Wired once in the root layout.",
    badge: "Context",
  },
  {
    icon: CodeIcon,
    name: "src/config/",
    desc: "Client and SDK configuration. The Axios instance, env-driven setup. Wiring, not usage.",
    badge: "Config",
  },
  {
    icon: GitBranchIcon,
    name: "src/utils/",
    desc: "Constants and reusable pure functions. Formatters, validators, route keys. Leaf helpers — no dependencies.",
    badge: "Utils",
  },
];

const principles = [
  {
    title: "Routes delegate, features implement",
    desc: "app/page.tsx stays thin — it renders a feature page component. All logic, data fetching, and UI live in the feature module. This is the #1 rule.",
  },
  {
    title: "One feature per domain",
    desc: "Sub-routes share one module. /user and /user/details both live in features/user/ — sharing api, components, hooks, and types. Only pages/ diverges per route.",
  },
  {
    title: "Dependencies flow one way",
    desc: "app → features → components → hooks + api → types + shared. Leaf layers (shared, config, utils, providers) never import from features. Enforced by ESLint.",
  },
  {
    title: "shadcn/ui is the default",
    desc: "Any UI primitive shadcn supports is added via the CLI, not hand-rolled. Generated into src/shared/components/ui/ with consistent theming.",
  },
  {
    title: "Boundaries are enforced",
    desc: "ESLint import-boundary rules turn the architecture rules into build failures. An AI agent that violates the structure gets caught — not silently merged.",
  },
  {
    title: "AGENTS.md in every layer",
    desc: "Each src/ subfolder has its own AGENTS.md with detailed rules. AI agents read the relevant guide before writing code in that layer.",
  },
];

const stack = [
  { name: "Next.js 16", desc: "App Router, Turbopack, proxy-based middleware" },
  { name: "React 19", desc: "Latest React with server components support" },
  { name: "TanStack Query", desc: "Server state management with useQuery / useMutation" },
  { name: "Axios", desc: "HTTP client with interceptors, env-driven base URL" },
  { name: "NextAuth", desc: "Credentials-based auth with JWT sessions" },
  { name: "shadcn/ui", desc: "Composable component library on Tailwind v4" },
  { name: "Tailwind CSS v4", desc: "Utility-first styling with OKLCH color tokens" },
  { name: "TypeScript", desc: "Strict mode, path aliases, module augmentation" },
];

const codeSnippet = `// app/login/page.tsx — thin route entry
import { LoginPage } from "@/features/auth/pages";

export default function Page() {
  return <LoginPage />;
}`;

const dataLayerSnippet = `// src/features/users/api/index.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/config/api-client";
import type { User } from "@/features/users/types";

async function fetchUsers(): Promise<User[]> {
  const { data } = await apiClient.get<{ data: User[] }>("/users");
  return data.data;
}

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
    staleTime: 1000 * 60 * 5,
  });
}`;

const eslintSnippet = `// eslint.config.mjs — enforced boundaries
{
  files: ["src/shared/**/*.{ts,tsx}"],
  rules: {
    "no-restricted-imports": ["error", {
      patterns: [{
        group: ["@/features/*", "app/*"],
        message: "@/shared is a leaf layer — \
it must not import from @/features or app/.",
      }],
    }],
  },
}`;

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ---------------------------------------------------------------- */}
      {/*  Nav                                                              */}
      {/* ---------------------------------------------------------------- */}
      <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <LayersIcon className="size-4.5" />
            </div>
            <span className="text-base font-semibold tracking-tight">
              Next Scaffold
            </span>
          </div>
          <div className="hidden items-center gap-1 md:flex">
            <a
              href="#architecture"
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Architecture
            </a>
            <a
              href="#principles"
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Principles
            </a>
            <a
              href="#code"
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Code
            </a>
            <a
              href="#stack"
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Stack
            </a>
          </div>
          <a href="#get-started" className={buttonVariants({ size: "sm", variant: "outline" })}>
            Get Started
          </a>
        </div>
      </nav>

      {/* ---------------------------------------------------------------- */}
      {/*  Hero                                                             */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative overflow-hidden border-b border-border/40">
        {/* Gradient glow */}
        <div
          className="pointer-events-none absolute inset-0 opacity-50"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 0%, oklch(0.7 0.15 250 / 0.15) 0%, transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-4xl px-6 py-24 text-center sm:py-32">
          <div className="mb-6 flex justify-center">
            <Badge variant="secondary" className="gap-1.5 px-3 py-1 text-xs">
              <SparklesIcon className="size-3" />
              Built for AI-assisted development
            </Badge>
          </div>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            The Next.js scaffold that keeps your AI on the rails
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            A modular, feature-sliced architecture with enforced boundaries,
            per-layer agent guides, and shadcn/ui — so your AI writes code that
            actually fits the project, not code you have to rewrite.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#get-started"
              className={buttonVariants({ size: "lg" })}
            >
              Start building
              <ArrowRightIcon className="size-4" />
            </a>
            <a
              href="#architecture"
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              Explore the architecture
            </a>
          </div>

          {/* Stats row */}
          <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border/60 bg-border/60 sm:grid-cols-4">
            {[
              { label: "Feature slices", value: "5 folders" },
              { label: "Enforced rules", value: "ESLint" },
              { label: "Agent guides", value: "6 files" },
              { label: "UI components", value: "shadcn/ui" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-background px-4 py-5 text-center"
              >
                <div className="text-xl font-semibold">{stat.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/*  Architecture — folder structure                                  */}
      {/* ---------------------------------------------------------------- */}
      <section
        id="architecture"
        className="border-b border-border/40 py-24"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Two worlds, one direction
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              The codebase splits into <code className="text-foreground">app/</code>{" "}
              for routing and <code className="text-foreground">src/</code> for
              everything else. Dependencies flow inward and downward — never
              sideways, never upward.
            </p>
          </div>

          {/* Dependency flow diagram */}
          <div className="mx-auto mt-12 flex max-w-3xl flex-wrap items-center justify-center gap-2 text-sm">
            {[
              "app/ routes",
              "features/pages",
              "components",
              "hooks + api",
              "types + shared",
            ].map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <span className="rounded-lg border border-border/60 bg-muted/50 px-3 py-1.5 font-medium">
                  {step}
                </span>
                {i < 4 && (
                  <ArrowRightIcon className="size-4 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>

          {/* Layer cards */}
          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {layers.map((layer) => {
              const Icon = layer.icon;
              return (
                <Card key={layer.name} className="relative overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="size-5" />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {layer.badge}
                      </Badge>
                    </div>
                    <CardTitle className="mt-3 font-mono text-base">
                      {layer.name}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {layer.desc}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/*  Principles                                                       */}
      {/* ---------------------------------------------------------------- */}
      <section id="principles" className="border-b border-border/40 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Principles that hold the structure together
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Six rules that every AI agent working in this scaffold must
              follow. They&apos;re documented, they&apos;re enforced, and they
              keep the codebase coherent as it grows.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2">
            {principles.map((principle, i) => (
              <div
                key={principle.title}
                className="flex gap-4 rounded-xl border border-border/40 p-6"
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-semibold">{principle.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {principle.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/*  Code examples                                                    */}
      {/* ---------------------------------------------------------------- */}
      <section id="code" className="border-b border-border/40 py-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              See it in code
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              The conventions aren&apos;t just prose — they&apos;re patterns you
              can copy. Here&apos;s what each layer looks like in practice.
            </p>
          </div>

          <div className="mt-12">
            <Tabs defaultValue="routing" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="routing">Route → Feature</TabsTrigger>
                <TabsTrigger value="data">Data Layer</TabsTrigger>
                <TabsTrigger value="enforcement">Enforcement</TabsTrigger>
              </TabsList>

              {/* Routing tab */}
              <TabsContent value="routing" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Routes delegate to feature pages
                    </CardTitle>
                    <CardDescription>
                      The <code>app/</code> route file stays thin. It imports a
                      page component from the feature and renders it. No data
                      fetching, no business logic, no substantial JSX.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm leading-relaxed">
                      <code className="font-mono">{codeSnippet}</code>
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Data tab */}
              <TabsContent value="data" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Feature api/ calls apiClient directly
                    </CardTitle>
                    <CardDescription>
                      Each feature&apos;s <code>api/</code> folder calls the
                      configured Axios instance directly, shapes the response,
                      and wraps it in React Query hooks. No shared wrapper — the
                      feature owns its data layer.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm leading-relaxed">
                      <code className="font-mono">{dataLayerSnippet}</code>
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Enforcement tab */}
              <TabsContent value="enforcement" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      ESLint enforces the boundaries
                    </CardTitle>
                    <CardDescription>
                      The modularity rules are encoded as ESLint
                      <code> no-restricted-imports</code> patterns. A leaf layer
                      that tries to import from <code>@/features</code> fails
                      the build — not just a warning, a hard error.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm leading-relaxed">
                      <code className="font-mono">{eslintSnippet}</code>
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/*  Feature module anatomy                                           */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-b border-border/40 py-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Inside a feature module
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Every feature follows the same five-folder shape. Consistent
              structure means any agent can navigate a feature without reading
              it first.
            </p>
          </div>

          <div className="mt-12 rounded-xl border border-border/40 bg-muted/30 p-6 sm:p-8">
            <pre className="overflow-x-auto font-mono text-sm leading-relaxed text-muted-foreground">
              <span className="text-foreground">src/features/auth/</span>
              {"\n"}
              {"├── "}
              <span className="text-foreground">api/</span>
              {"          # Server communication + React Query hooks\n"}
              {"├── "}
              <span className="text-foreground">components/</span>
              {"   # Feature-scoped UI (ACTIVE — not a placeholder)\n"}
              {"├── "}
              <span className="text-foreground">hooks/</span>
              {"        # Non-data hooks (state, effects, helpers)\n"}
              {"├── "}
              <span className="text-foreground">pages/</span>
              {"        # Page compositions — one file per route\n"}
              {"├── "}
              <span className="text-foreground">types/</span>
              {"        # TypeScript types and module augmentations\n"}
              {"└── "}
              <span className="text-foreground">index.ts</span>
              {"      # Public barrel re-exporting the module's API\n"}
            </pre>

            <Separator className="my-6" />

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                "Sub-routes share one module — /user and /user/details both live in features/user/",
                "Components folder is active — build UI there, not in routes or pages",
                "Data hooks go in api/, not hooks/ — useQuery / useMutation only",
                "Kebab-case filenames, PascalCase exports — login-form.tsx → LoginForm",
                "shadcn/ui for any primitive it supports — don't hand-roll buttons",
                "AGENTS.md in every src/ subfolder — agents read before writing",
              ].map((rule) => (
                <div key={rule} className="flex items-start gap-2.5">
                  <CheckIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span className="text-sm text-muted-foreground">{rule}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/*  Stack                                                            */}
      {/* ---------------------------------------------------------------- */}
      <section id="stack" className="border-b border-border/40 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              The stack
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Modern, typed, and battle-tested. Every piece is chosen to work
              well with AI-generated code.
            </p>
          </div>

          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stack.map((tech) => (
              <div
                key={tech.name}
                className="rounded-xl border border-border/40 p-5 transition-colors hover:border-border"
              >
                <h3 className="font-semibold">{tech.name}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {tech.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/*  Get started / CTA                                                */}
      {/* ---------------------------------------------------------------- */}
      <section id="get-started" className="border-b border-border/40 py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <TerminalIcon className="size-6" />
            </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Get started in seconds
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Clone, install, and start building. The architecture, enforcement,
            and agent guides are already in place.
          </p>

          <div className="mx-auto mt-8 max-w-lg rounded-xl border border-border/60 bg-muted/30 p-4 text-left">
            <pre className="overflow-x-auto font-mono text-sm leading-relaxed">
              <span className="text-muted-foreground"># Clone and install</span>
              {"\n"}
              <span className="text-foreground">git clone</span> &lt;repo-url&gt;
              {"\n"}
              <span className="text-foreground">cd</span> next-scaffold
              {"\n"}
              <span className="text-foreground">npm install</span>
              {"\n\n"}
              <span className="text-muted-foreground"># Start developing</span>
              {"\n"}
              <span className="text-foreground">npm run dev</span>
              {"\n\n"}
              <span className="text-muted-foreground">
                {"# Add a UI component"}
              </span>
              {"\n"}
              <span className="text-foreground">npx shadcn@latest add</span>{" "}
              button
              {"\n\n"}
              <span className="text-muted-foreground">
                {"# Verify structure"}
              </span>
              {"\n"}
              <span className="text-foreground">npm run lint</span>
              {"  "}
              <span className="text-muted-foreground">
                {"# enforces boundaries"}
              </span>
            </pre>
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#architecture"
              className={buttonVariants({ size: "lg" })}
            >
              Read the architecture
              <ArrowRightIcon className="size-4" />
            </a>
            <a
              href="#principles"
              className={buttonVariants({ size: "lg", variant: "outline" })}
            >
              Review the principles
            </a>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/*  Footer                                                           */}
      {/* ---------------------------------------------------------------- */}
      <footer className="py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <LayersIcon className="size-4" />
            </div>
            <span className="text-sm font-medium">Next Scaffold</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Built for vibe coders who ship with AI.
          </p>
        </div>
      </footer>
    </div>
  );
}
