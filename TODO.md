# TODO — outstanding work

Non-urgent follow-ups from getting the fork live on 2026-10-01 ([PR #2](https://github.com/MilesETait/invoicely/pull/2)). None of these block day-to-day use of https://invoicely-eight-fawn.vercel.app. They're roughly ordered by how likely you are to notice them.

## 1. Configure Cloudflare R2 for signed-in image uploads

**What breaks:** signed in with "Allow data sync" on, uploading a logo or signature "to server" (Assets page, or the image picker on the invoice form) fails. Local (browser) image uploads still work.

**Why:** there is no R2 bucket. The five `CF_R2_*` env vars in Vercel are placeholders, and the app still builds image URLs from upstream's storage domain.

**Where:**

- Vercel env: `CF_R2_ENDPOINT`, `CF_R2_ACCESS_KEY_ID`, `CF_R2_SECRET_ACCESS_KEY`, `CF_R2_BUCKET_NAME`, `CF_R2_PUBLIC_DOMAIN` (all placeholders)
- `apps/web/src/constants/index.ts`: `R2_PUBLIC_URL` is hardcoded to `https://storage.invoicely.gg`
- `apps/web/next.config.ts`: `images.remotePatterns` only allows `storage.invoicely.gg` and `assets.invoicely.gg`

**How:**

1. Create an R2 bucket with a public domain.
2. Replace the five placeholders in Vercel.
3. Make `R2_PUBLIC_URL` come from a new optional `NEXT_PUBLIC_R2_PUBLIC_URL` (add it to `packages/utilities/src/env/index.ts`).
4. Add the bucket's host to `remotePatterns`.
5. Re-pull the env locally.

## 2. Delete the test invoice

Local testing saved an invoice ("Invoicely Ltd", the form's demo data) to the production database under your account. Delete it from the Invoices list.

## 3. Stop depending on `invoicely.gg` for assets and metadata

**What breaks:** nothing yet. Upstream's asset host was still serving on 2026-10-01 even though their app was down. If it goes away, the landing page's sponsor logos and the blog OG image break.

**Where:**

- `assets.invoicely.gg` images: `components/layout/landing/our-sponser.tsx`, `app/api/og/route.tsx`
- `invoicely.gg` as the canonical site: `constants/meta-data.ts` (`metadataBase`), `app/sitemap.ts`, `app/(marketing)/blog/[slug]/page.tsx`, and links inside `src/content/blogs/*.mdx`
- `providers/onedollarstats-provider.tsx`: the `data-debug` attribute names `invoicely.gg`. It only applies in development, and the provider isn't mounted in the current layout.

**How:** copy the images into `apps/web/public/` and reference them locally. For metadata, decide whether the fork should present itself as its own site or keep pointing canonical URLs at upstream. For a personal deployment, leaving them is defensible.

## 4. Exercise the two untested flows

Both ran without problems in code review but were never clicked through:

- **Invoice Details preset section.** Its field mapping in `create/invoice/invoice-form.tsx` was moved into `AccordionTrigger`'s `actions` prop but not changed. The other four sections were tested.
- **"Migrate to DB" for a local invoice.** This is upstream code, untouched by the fork. To test it: turn "Allow data sync" off, save an invoice (it goes to IndexedDB), turn sync back on, then use "Migrate to DB" in the Invoices list.

## 5. Give local development its own database

**Risk:** `vercel env pull .env` gives Development the same Neon database as production, so anything tested locally writes real rows to your live data. That's how the test invoice in item 2 got there.

**How:** create a Neon branch (e.g. `dev`) from the main branch, then set Development's `DATABASE_URL` / `DATABASE_URL_UNPOOLED` in Vercel to that branch's connection strings. The Neon integration settings may also offer this. Run `yarn db:migrate` against it once.

## Smaller items noted along the way

- **Forbidden writes return HTTP 500, not 403.** With sync off, `preset.insert` is correctly rejected with "Not allowed to save data", but the status is 500. The likely cause is the shared Effect pattern: `Effect.runPromise` wraps the `TRPCError` in a FiberFailure, which tRPC reports as an internal error. `insertInvoice` probably behaves the same way (not confirmed). This is upstream's pattern; a fix belongs in how services unwrap Effect failures, not in one service.
- **Local presets don't move to the server when you turn sync on.** They stay in that browser, listed alongside server presets. Invoices have "Migrate to DB"; presets have no equivalent.
- **`.claude/settings.local.json` is committed.** It's a per-machine Claude Code permission allowlist and arguably belongs in `.gitignore`. Flagged in September, left alone.
