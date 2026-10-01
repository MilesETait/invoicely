# Invoicely — Tech Stack Reference

## Framework & Runtime

- **Next.js 15.5.18** — App Router, Turbopack (dev)
- **React 19.1.4** / React DOM 19.1.4
- **TypeScript 5.8.2** — strict mode, bundler module resolution
- **Node.js ≥ 20**

## Monorepo

- **Turborepo 2.9.15** — task-based caching and orchestration
- **Yarn 4.9.1** workspaces
- Workspaces: `apps/web`, `packages/db`, `packages/utilities`, `packages/eslint-config`, `packages/typescript-config`

## Database & ORM

- **PostgreSQL on Neon** — the client in `packages/db/src/index.ts` uses `drizzle-orm/neon-http`, which only speaks Neon's HTTP protocol. Supabase or plain Postgres would need a driver swap (e.g. `drizzle-orm/postgres-js`)
- **Drizzle ORM 0.45.2** — type-safe query builder
- **Drizzle Kit 0.31.10** — migrations and schema management
- Schema: `packages/db/src/schema/`
- Migrations: `packages/db/migrations/`

## Local Storage

- **IndexedDB** via `idb 8.0.3`
- Database name: `invoicelygg`
- Version 3. Object stores: `inv_invoices`, `inv_images`, `inv_presets`, `inv_default_details`
- Each store is created with an `objectStoreNames.contains()` check rather than gated on `oldVersion`, because the fork and upstream each shipped a different v2
- Used for offline/unauthenticated invoice, asset, preset, and default-details storage

## API Layer

- **tRPC 11.17.0** — end-to-end type-safe API
- **TanStack React Query 5.76.1** — server state management
- **SuperJSON / devalue** — serialization for dates and complex types

## State Management

- **Jotai 2.12.3** — atomic client state (invoice errors, tab state)
- **react-hook-form 7.56.1** + **@hookform/resolvers 5.0.1** — form state
- **Zod 3.25.7** — schema validation (forms, tRPC inputs, env vars)

## UI & Styling

- **Radix UI** — headless primitives (accordion, avatar, checkbox, dialog, dropdown, label, popover, scroll-area, select, separator, slider, switch, tabs, tooltip)
- **shadcn/ui** — styled component layer built on Radix
- **Tailwind CSS 4** — utility-first CSS with OKLch color tokens
- **Class Variance Authority (CVA) 0.7.1** — component variant management
- **tailwind-merge 3.2.0** + **clsx** — class merging (`cn()` utility in `src/lib/utils.ts`)
- **Lucide React 0.506.0** — icon library
- **Motion 12.10.5** — animation library
- **next-themes 0.4.6** — dark/light mode switching
- **tw-animate-css** — Tailwind animation utilities

## Fonts

Geist Sans, Geist Mono, JetBrains Mono, Instrument Serif, Instrument Sans, Urbanist, Bricolage Grotesque — configured in `apps/web/src/app/fonts.css`.

## Authentication

- **better-auth 1.6.2** — auth framework with Drizzle adapter
- Google OAuth provider
- Custom field: `allowedSavingData` (boolean)

## PDF Generation

- **@react-pdf/renderer 4.3.0** — server/client PDF rendering
- **react-pdf 9.2.1** — PDF viewer

## Data Table

- **TanStack React Table 8.21.3** — headless table with sorting, filtering, pagination
- Custom filter system in `src/components/ui/data-table-filter/`

## Analytics & Monitoring

- **PostHog** — product analytics; optional, only initialised when `NEXT_PUBLIC_POSTHOG_KEY` is set
- **OpenPanel** — privacy-focused analytics
- **Vercel Analytics** — performance analytics
- **Sentry** — error tracking; optional, client/server/edge all read `NEXT_PUBLIC_SENTRY_DSN` and stay disabled when it's unset
- **React Scan** — performance debugging (dev)

## File Storage

- **Cloudflare R2** (S3-compatible) — logo/signature image hosting for signed-in users. Image URLs are still built from the hardcoded `R2_PUBLIC_URL` (`storage.invoicely.gg`) in `apps/web/src/constants/index.ts`, so the fork needs that made configurable before using its own bucket
- **AWS SDK** — S3 client for R2 operations

## Content

- **Content Collections** (@content-collections) — MDX blog content

## Code Quality

- **ESLint 9** — shared config in `packages/eslint-config`
- **Prettier 3.5.3** — formatting (print width 120, trailing commas, double quotes)
- **Husky 9.1.7** — git hooks

## Environment

- **@t3-oss/env-nextjs** — type-safe environment variable validation with Zod
- **dotenv-cli** — env loading for CLI scripts

## Key Patterns

- **Dual storage**: invoices saved to IndexedDB (local/offline) or PostgreSQL (authenticated), with migration path between them
- **Effect system**: `effect` library used in tRPC service layer for error handling
- **Compound components**: Radix composition pattern (e.g., `Card` → `CardHeader`, `CardContent`, `CardFooter`)
- **Path aliases**: `@/*` → `./src/*`, `@/icons` → `./src/assets/icons`
