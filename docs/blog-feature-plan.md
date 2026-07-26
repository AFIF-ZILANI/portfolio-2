# Blog + Series for afifzilani.com

> **Status:** planned, not started. Phase 0 is Afif's to do (accounts, env vars, dashboard settings).
> Everything from Phase 1 on is implementation work. Ping me when Phase 0 is done or if any of the
> decisions below should change.

## Context

The portfolio is currently a **single-page site**: one route (`/`), all content hardcoded in
[site-data.ts](../src/lib/site-data.ts), no database, no auth, no CMS, no markdown tooling. The only
server code is [route.ts](../src/app/api/contact/route.ts) (nodemailer).

The goal is to publish writing from a real admin panel — create, edit, delete posts with cover
images, SEO metadata, tags, drafts, scheduled publishing, and multi-part series. Because
`/admin/blogs/create` must *write* content, file-based MDX is off the table (Vercel's filesystem is
read-only). This introduces the first database, the first auth, and the first server-rendered pages
on the site.

**Stack decided:** Prisma ORM → Prisma Postgres (Vercel Marketplace) · Vercel Blob for images ·
Clerk for admin auth · markdown + live preview editor · series as metadata with in-post navigation
(no dedicated series pages) · drafts + scheduled publish · reading time + view counts · admin
uploads their own OG images (no AI generation).

**Deliberately out of scope:** comments, RSS beyond the sitemap, categories separate from tags,
multi-author, AI-generated OG images, `/blogs/series/:slug` landing pages.

### Routes

| Route | Purpose |
|---|---|
| `/blogs` | Grid of all published posts + search bar |
| `/blogs/:slug` | The post |
| `/admin/blogs` | Post list — edit / delete / new |
| `/admin/blogs/create` | Full editor |
| `/admin/blogs/:id/edit` | Same editor, prefilled *(needed for the edit action)* |
| `/admin/series` | Series list — create / rename / delete |
| `/admin/sign-in` | Clerk sign-in |

---

## Phase 0 — Provision (Afif's part)

The Vercel CLI is **not installed**. First: `npm i -g vercel`, then `vercel link`.

```bash
vercel integration add prisma --yes     # Prisma Postgres → DATABASE_URL
vercel integration add clerk --yes      # → CLERK_SECRET_KEY, NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
vercel blob store add                   # → BLOB_READ_WRITE_TOKEN
vercel env pull .env.local --yes
```

Run `vercel integration guide prisma --framework nextjs` and follow its current output for the
client/adapter wiring rather than assuming an API shape — Prisma Postgres connection setup has moved
recently.

Anything that hands off to a browser/dashboard step gets finished there.

**Then, in the Clerk dashboard: disable public sign-ups.** Clerk lets anyone register by default;
without this, anyone could create an account. Belt-and-braces, the code also checks a single
`ADMIN_USER_ID` env var (Phase 2) — grab your Clerk user ID after first sign-in and set it.

**Env vars when done:**

```
DATABASE_URL=                          # Prisma Postgres
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/admin/sign-in
ADMIN_USER_ID=                         # your Clerk user id
BLOB_READ_WRITE_TOKEN=
```

Deps to add:
```
@prisma/client  prisma(dev)  @clerk/nextjs  @vercel/blob
react-markdown  remark-gfm  rehype-highlight
```
`npx shadcn@latest add select switch` — the editor needs both; `alert-dialog`, `badge`, `button`,
`input`, `label`, `textarea`, `sonner` already exist and get reused.

`package.json`: `"build": "prisma generate && next build"`.

---

## Phase 1 — Data layer

### `prisma/schema.prisma` (new)

```prisma
enum PostStatus { DRAFT PUBLISHED }

model Post {
  id             String     @id @default(cuid())
  slug           String     @unique
  title          String
  excerpt        String                        // meta description fallback + card blurb
  content        String                        // markdown source
  coverImage     String?                       // Blob URL
  coverAlt       String?
  ogImage        String?                       // Blob URL, admin-supplied
  tags           String[]
  status         PostStatus @default(DRAFT)
  publishedAt    DateTime?                     // future date = scheduled
  readingMinutes Int        @default(1)
  views          Int        @default(0)
  seoTitle       String?
  seoDescription String?
  canonicalUrl   String?
  noindex        Boolean    @default(false)
  series         Series?    @relation(fields: [seriesId], references: [id], onDelete: SetNull)
  seriesId       String?
  seriesOrder    Int?
  createdAt      DateTime   @default(now())
  updatedAt      DateTime   @updatedAt

  @@index([status, publishedAt])
  @@index([seriesId, seriesOrder])
}

model Series {
  id          String   @id @default(cuid())
  slug        String   @unique
  title       String
  description String?
  coverImage  String?
  posts       Post[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

**Scheduled publish needs no cron.** A post is live when `status = PUBLISHED AND publishedAt <= now()`.
Every public query carries that filter; `export const revalidate = 60` on the public routes means a
scheduled post appears within a minute of its time. Simplest thing that works.

### `src/lib/prisma.ts` (new)

Standard `globalThis` singleton so dev HMR doesn't open a new pool per reload.
**Do not wrap the client in a `Proxy`** — it breaks libraries that introspect the client.

### `src/lib/blog.ts` (new)

Pure helpers + all query functions in one file:

- `slugify(title)` — lowercase, strip non-alphanumerics, collapse dashes.
- `readingMinutes(markdown)` — `Math.max(1, Math.ceil(words / 200))`. Computed on save, stored.
- `PUBLISHED` — the shared `where` fragment above. **One exported const, imported by every public
  query and the sitemap** — this is the root-cause guard against a draft leaking through a route
  that forgot the filter.
- `getPublishedPosts()`, `getPostBySlug(slug)`, `getSeriesPosts(seriesId)`, `getAllSeries()`.

### `src/lib/blog.test.ts` (new)

Bun's built-in test runner (`bun.lock` is already in the repo — zero new deps, TS native).
Covers the three things that silently break: `slugify` edge cases, `readingMinutes` rounding, and
that `PUBLISHED` excludes both drafts and future-dated posts. Run with `bun test`.

---

## Phase 2 — Auth (Clerk, scoped to `/admin` only)

**`ClerkProvider` goes in `src/app/admin/layout.tsx`, NOT the root layout.** The public site is the
SEO-critical part and must not ship Clerk's JS to every visitor.

### `src/middleware.ts` (new — none exists today)

`clerkMiddleware` with `await auth.protect()`, matcher scoped to `/admin/:path*` and
`/api/admin/:path*`. Everything else bypasses it entirely.

Note this is Next **15.3**, so the file is `middleware.ts` (`proxy.ts` is a Next 16 rename).

### `src/app/admin/layout.tsx` (new)

`ClerkProvider` → `const { userId } = await auth()` → if `userId !== process.env.ADMIN_USER_ID`,
`notFound()`. Single-admin lock independent of Clerk's dashboard settings. Renders a thin admin nav
(Posts / Series / `<UserButton />`).

### `src/app/admin/sign-in/[[...sign-in]]/page.tsx` (new)

Drop-in `<SignIn />`. Lives under `/admin` so the provider already wraps it.

Clerk v7 note: `auth()` and `clerkClient()` are **async** — always `await`.

---

## Phase 3 — Admin CRUD

Server Actions, not route handlers — no fetch plumbing, no manual JSON.

### `src/app/admin/actions.ts` (new)

`createPost`, `updatePost`, `deletePost`, `upsertSeries`, `deleteSeries`, `uploadImage`.

**Every action re-checks `userId === ADMIN_USER_ID` on its own.** Server Actions are POST endpoints
reachable independently of the page that renders them — middleware protection is not sufficient.

Each mutation ends with `revalidatePath("/blogs")` + `revalidatePath("/blogs/[slug]", "page")` +
`revalidatePath("/sitemap.xml")`.

`uploadImage` takes `FormData` → `put(name, file, { access: "public" })` from `@vercel/blob`, returns
the URL. Requires `experimental.serverActions.bodySizeLimit: "8mb"` in `next.config.ts` (default is
1MB and a cover screenshot will exceed it).

### `src/components/admin/post-editor.tsx` (new)

One client component, shared by create and edit — the only difference is prefilled values and which
action it calls. Split pane:

- **Left:** title (auto-slugs, slug stays manually overridable), excerpt, markdown `<textarea>`.
- **Right:** live preview through the exact same `<Markdown>` component the public post page uses,
  so what you see is what ships.
- **Sidebar:** status `<Select>` (Draft/Published), `publishedAt` — plain `<input type="datetime-local">`,
  no date-picker library — tags (comma-separated input → `string[]`), series `<Select>` with an
  inline "＋ new series" field, series order number, cover image + alt, OG image, and a collapsed
  **SEO** block (seoTitle, seoDescription, canonicalUrl, `noindex` `<Switch>`).
- Both image fields: file input → `uploadImage` → preview thumbnail. Live character counters on
  seoTitle (60) and seoDescription (160).

### `src/app/admin/blogs/page.tsx`, `create/page.tsx`, `[id]/edit/page.tsx` (new)

The list is a table: title, status badge, series, published date, views, edit/delete. Delete uses the
already-installed `alert-dialog` for confirmation; all feedback via the already-installed `sonner`
toaster. Reuse the `bg-card border border-border hover:border-primary` card treatment from
[skills.tsx:96-129](../src/components/sections/skills.tsx#L96-L129) so admin matches the site.

### `src/app/admin/series/page.tsx` (new)

Small list + inline create/rename/delete. Deleting a series sets member posts' `seriesId` to null
(`onDelete: SetNull`) rather than deleting posts.

---

## Phase 4 — Public routes

### `src/app/blogs/page.tsx` (new) — server component

Fetches published posts + series, renders `<BlogIndex>`. `export const revalidate = 60`.

### `src/components/blog/blog-index.tsx` (new) — client component

Search bar + tag chips + series filter, all filtering the already-loaded array in a `useMemo` over
title/excerpt/tags. **No search API, no search index** — a personal blog has tens of posts, and
client-side filter is instant and free.

```ts
// ponytail: client-side filter over the full post list. Fine to ~200 posts;
// move to Postgres full-text (pg_trgm) if it ever gets slow.
```

Grid of cards: cover image via `next/image` in the `relative aspect-video` + `fill` wrapper pattern
from [projects.tsx:39-46](../src/components/sections/projects.tsx#L39-L46), title, excerpt, tags,
reading time, date, series label. Entrance animation reuses the `containerVariants`/`itemVariants`
stagger pair from [skills.tsx:66-78](../src/components/sections/skills.tsx#L66-L78).

### `src/app/blogs/[slug]/page.tsx` (new)

`generateStaticParams` over published slugs, `revalidate = 60`. `notFound()` when the slug misses or
the post isn't live — **reuse the existing terminal-styled** [not-found.tsx](../src/app/not-found.tsx).

Renders: cover, title, date, reading time, `<ViewCounter>`, tags, `<Markdown>` body, `<SeriesNav>`.

### `src/components/blog/markdown.tsx` (new)

`react-markdown` + `remark-gfm` + `rehype-highlight`, wrapped in
`prose prose-invert prose-headings:font-mono max-w-none`. **`@tailwindcss/typography` is already
installed and registered in [globals.css](../src/app/globals.css) but `prose` is used nowhere yet** —
this finally uses it. Highlight.js theme goes in `globals.css`, tuned to the existing green `--primary`.

Raw HTML stays disabled (react-markdown's default), so no `rehype-sanitize` is needed.

### `src/components/blog/series-nav.tsx` (new)

When `seriesId` is set: a bordered box reading "Part 2 of 5 · <series title>" listing every published
sibling ordered by `seriesOrder`, current part marked, others linked.

### `src/components/blog/view-counter.tsx` + `src/app/api/views/[slug]/route.ts` (new)

Client component POSTs on mount; the route does `prisma.post.update({ data: { views: { increment: 1 } } })`
and returns the new count, which the component renders. Keeps the counter live despite ISR, and keeps
the write off the cached render path.

```ts
// ponytail: no dedupe — refreshes recount. Add an IP+slug day-bucket if the number starts mattering.
```

### `src/components/layout/navbar.tsx` (modify)

Add a real `/blogs` `<Link>`. The pattern is already written and commented out at
[navbar.tsx:59-68](../src/components/layout/navbar.tsx#L59-L68) (the dead `/events` link) — uncomment,
retarget, delete the dead `/dashboard` block at lines 87-95 while there.

---

## Phase 5 — SEO

1. **`src/app/blogs/[slug]/page.tsx` — `generateMetadata`.** The repo's **first** one. Title (seoTitle
   → title), description (seoDescription → excerpt), `alternates.canonical`, openGraph
   `type: "article"` with `publishedTime`/`modifiedTime`/`tags`/`authors` and the OG image, twitter
   `summary_large_image`, and `robots: { index: false }` when `noindex`. The
   `"%s | Afif Zilani"` template in [layout.tsx:8-104](../src/app/layout.tsx#L8-L104) applies automatically.

2. **`BlogPosting` JSON-LD** on the post page, with `author` pointing at the existing
   `https://afifzilani.com/#person` `@id` so posts attach to the established Person entity —
   directly reinforcing the name-ranking work from the June SEO overhaul. `Blog` JSON-LD on `/blogs`.

3. **Fix `PersonaSchema`.** [PersonaSchema.tsx](../src/components/PersonaSchema.tsx) renders `Person` +
   `WebSite` + `ProfilePage` from the **root layout**, so every future route inherits a `ProfilePage`
   claim. A blog post declaring both `ProfilePage` and `BlogPosting` is contradictory. Split it:
   `Person` + `WebSite` stay global; move `ProfilePage` to the homepage only.

4. **`src/app/sitemap.ts`** — make it `async`, keep the existing homepage entry verbatim, append
   `/blogs` and one entry per published post (`lastModified: updatedAt`, and its `coverImage` in
   `images`). Uses the same `PUBLISHED` filter from `blog.ts`.

5. **`src/app/robots.ts`** — add `/admin/` to `disallow` alongside `/api/`.

6. **`next.config.ts`** — add the Vercel Blob hostname (`*.public.blob.vercel-storage.com`) to
   `images.remotePatterns`, and the server-action body limit from Phase 3.

---

## Verification

```bash
bun test                       # blog.ts helpers — slugify, reading time, PUBLISHED filter
bunx prisma migrate dev        # schema applies clean
bun run dev
```

Then, end to end:

1. `/admin/blogs` **while signed out** → redirected to sign-in. Sign in with a non-admin Clerk
   account → 404. Both must hold before anything else counts.
2. Create a post: upload a cover, add tags, assign a series, fill SEO fields. Confirm the live
   preview matches the rendered page.
3. Save as **Draft** → absent from `/blogs`, absent from `/sitemap.xml`, direct slug URL 404s.
4. Set **Published with a `publishedAt` 2 minutes out** → still absent; wait past the time, reload →
   appears. This is the scheduled-publish check.
5. Publish 3 posts in one series → `/blogs/:slug` shows "Part N of 3" with working sibling links.
6. `/blogs` search: filter by title text, by tag chip, by series. Verify reading time and view count
   render, and that the counter increments on reload.
7. Edit → changes appear on the public page within 60s (or immediately, via `revalidatePath`).
   Delete → gone from `/blogs`, gone from the sitemap.
8. `curl localhost:3000/sitemap.xml` and `/robots.txt` — posts listed, `/admin/` disallowed.
9. View source on a post: exactly one `BlogPosting`, no `ProfilePage`, canonical correct. Paste the
   URL into a link-preview checker for the OG image.
10. `bun run build` clean, then deploy to a Vercel **preview** URL and re-run steps 1 and 3 there —
    Clerk keys and Blob tokens behave differently outside localhost.

## Git

Per the repo workflow: branch `feat/blog-and-series` off `main`, verify, then merge and delete.
Given the size, commit per phase so the auth and SEO changes stay reviewable on their own.

## Open questions / things worth changing later

- **Prisma Postgres vs Neon** — locked in, but if you ever want per-preview-deploy database branching,
  Neon does that better.
- **Markdown vs WYSIWYG** — markdown chosen. If writing in a textarea gets old, Tiptap is a swap of
  the editor component only; the stored `content` column would need a migration.
- **`/blogs/series/:slug` pages** — skipped for now. Worth adding if you write long multi-part guides
  and want them ranking as a unit.
- Two dead things this touches near: `loadSiteData`/`saveSiteData` in `site-data.ts` (zero call sites,
  localStorage leftovers) and the unused `Event` type. Safe to delete in the same branch.
