# Afif Zilani

Personal site of Afif Zilani: entrepreneur, General Manager of ZeroD Farms, programmer, and Co-Founder of ZeroD Umb. It covers his ventures, a journal and events, with an admin dashboard for editing all of it.

[![Live](https://img.shields.io/badge/Live-afifzilani.com-14213D?style=flat-square)](https://afifzilani.com)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?style=flat-square&logo=prisma)](https://prisma.io)
[![License](https://img.shields.io/badge/License-MIT-D4A72C?style=flat-square)](./LICENSE)

The ZeroD group's sites: [zerod.bd](https://zerod.bd) · [farms.zerod.bd](https://farms.zerod.bd) · [agency.zerod.bd](https://agency.zerod.bd)

---

## What's on the site

| Route | What it is |
|---|---|
| `/` | Hero with rotating roles and stats, Ventures bento, About, Skills, pinned Events, latest Journal posts, Contact |
| `/blogs`, `/blogs/[slug]` | Journal: search, tag and series filters, reading progress |
| `/events`, `/events/[slug]` | Events grouped by year with tag filters; each event has a facts bar, a map link and a photo lightbox |
| `/admin` | Dashboard (Clerk sign-in, single admin) for site content, posts, events, series and media |
| `/sitemap.xml`, `/feed.xml`, `/llms.txt` | SEO, RSS and AI-crawler summaries, generated from the database |

**Almost all content lives in Postgres, not in code.** The homepage text, roles, ventures, stats, skills, social links and photos are edited at `/admin/site/*`. The values in `src/lib/site-data.ts` are only fallbacks for an empty database. Posts and events are edited at `/admin/blogs` and `/admin/events`. Pin an event there to feature it on the homepage.

Images are uploaded to Cloudinary through `/admin/media` and referenced by id. The portraits used for metadata and schema are set in `src/lib/site.ts`.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router, Turbopack), React 19, TypeScript 5 |
| Data | PostgreSQL via Prisma 7 (`@prisma/adapter-pg`) |
| Auth | Clerk (admin only) |
| Images | Cloudinary |
| Styling | Tailwind CSS v4, shadcn/ui on Radix |
| Type | Manrope (public site), Space Mono (admin) |
| Motion | Framer Motion, plus a vendored [stageshow](src/components/stageshow/kit) kit for the animated Ventures pictures |
| Email | Nodemailer (contact form) |
| Tests | `bun test` |

**Design system:** the public site is navy `#14213D` and gold `#D4A72C` on a warm off-white, light theme by default with a dark theme. The tokens are in `src/app/globals.css`, scoped to the public layout, so the admin keeps its own look.

---

## Getting started

Requires [Bun](https://bun.sh) 1.x (Node 20+ also works for running the app) and a PostgreSQL database.

```bash
git clone https://github.com/AFIF-ZILANI/portfolio-2.git
cd portfolio-2
bun install            # also runs `prisma generate`
# create .env with the variables in the table below, then:
bunx prisma migrate deploy
bun dev                # http://localhost:3000
```

### Environment variables

| Variable | Used for |
|---|---|
| `DATABASE_URL` | Postgres connection string |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` | Admin sign-in |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Usually `/signin` |
| `ADMIN_EMAIL` | The one account allowed into `/admin` |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_PRESET`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Image uploads and cleanup |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS` | Sending contact-form mail |
| `CONTACT_EMAIL` | Where contact messages go, unless overridden in admin |
| `NEXT_PUBLIC_SITE_URL` | Optional; canonical origin, defaults to `https://afifzilani.com` |

### Scripts

```bash
bun dev                     # dev server
bun run build && bun start  # production build
bun run lint                # ESLint
bun test                    # unit and server-action tests
bunx prisma migrate deploy  # apply migrations to DATABASE_URL
```

> **Careful:** the server-action tests (`src/app/(clerk)/admin/*.test.ts`) read and write the database in `DATABASE_URL`. They restore what they change, but point `DATABASE_URL` at a separate database before running them, never at production.

---

## Project structure

```
prisma/
  schema.prisma         SiteContent, Image, Post, Series, Event
  migrations/           apply with `prisma migrate deploy`
src/
  app/(site)/           public pages (home, blogs, events)
  app/(clerk)/          admin dashboard and sign-in
  app/api/              contact form, view counter, admin helpers
  components/sections/  homepage sections
  components/events/    event card, archive, gallery lightbox
  components/blog/      post card, index, markdown renderer
  components/stageshow/ animated venture pictures + vendored kit
  lib/                  data access (site content, blog, events, images)
```

---

## Deployment

Production is the **afifzilani** project on Vercel. Every push to `main` deploys automatically.

Migrations are **not** run by the build. When a change adds one under `prisma/migrations/`, run `bunx prisma migrate deploy` against the production database before (or immediately after) pushing.

---

## License

MIT © [Afif Zilani](https://afifzilani.com)

[GitHub](https://github.com/AFIF-ZILANI) · [LinkedIn](https://www.linkedin.com/in/afifzilani) · [X](https://x.com/afif_zilani)
