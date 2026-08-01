# Events, unified images, and a layout pass — 2026-08-01

Design agreed with Afif on 2026-08-01. Four decisions were his, not mine, and they
shape everything below:

- Keep the terminal/developer identity. Refine it; do not replace it.
- "GEO" means both senses: generative-engine (AI citation) **and** geographic.
- `/events` is retrospective only. Nothing is announced before it happens.
- One image table. Every other table refers to it.

Max images per event is **10** (1 cover + up to 9 gallery), minimum 1 — my call,
delegated. A recap is skimmable at 4–8 photos; past ten it becomes an album needing
a lightbox and pagination. The binding constraint is not page weight, it is that
every image needs an alt written by hand. Ten alts get written. Twenty get skipped,
and a blank alt is worse than a missing photo.

## Architecture

### One image table

`Upload` becomes `Image` and every image on the site becomes a row in it — blog
covers, event photos, hero and about portraits, project screenshots.

```prisma
model Image {
  id        String   @id @default(cuid())
  url       String   @unique
  alt       String   @default("")
  caption   String?
  width     Int      @default(0)
  height    Int      @default(0)
  bytes     Int      @default(0)
  publicId  String?  @unique
  createdAt DateTime @default(now())

  posts   Post[] @relation("PostCover")
  ogPosts Post[] @relation("PostOg")

  @@index([createdAt])
}
```

`publicId` is nullable. Unification means this table holds assets Cloudinary does
not own — `/afifzilani-profile.webp`, the Unsplash project covers. A null
`publicId` means "not ours to destroy", and `cleanupOrphans` skips those rows
instead of failing on them.

`width`/`height` come free in Cloudinary's upload response. Storing them lets
`next/image` reserve space, which removes layout shift on every gallery.

### Post refers to Image

```prisma
coverImage   Image?  @relation("PostCover", fields: [coverImageId], references: [id], onDelete: SetNull)
coverImageId String?
ogImage      Image?  @relation("PostOg", fields: [ogImageId], references: [id], onDelete: SetNull)
ogImageId    String?
```

The `coverImage`, `coverAlt`, and `ogImage` string columns are dropped. Alt text
lives on `Image` now, so a cover used in two places cannot describe itself two
different ways.

Two image slots means two foreign keys, and `onDelete: SetNull` comes for free.

### Event

```prisma
model Event {
  id       String   @id @default(cuid())
  slug     String   @unique
  title    String
  excerpt  String
  content  String
  imageIds String[]

  startDate DateTime
  endDate   DateTime?

  venueName     String?
  streetAddress String?
  city          String?
  region        String?
  country       String  @default("BD")
  latitude      Float?
  longitude     Float?

  organizer String?
  role      String?
  tags      String[]

  status      PostStatus @default(DRAFT)
  publishedAt DateTime?

  seoTitle       String?
  seoDescription String?
  canonicalUrl   String?
  noindex        Boolean @default(false)

  views     Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([status, publishedAt])
}
```

`imageIds` is an ordered array, not a join table. An event gallery is ordered
1–10, and expressing that with foreign keys costs a join table with a `position`
column plus a join on every read. Postgres arrays give ordering for free.

The usual objection to arrays — dangling ids after a delete — does not apply here.
`cleanupUnusedImages()` is the only delete path in the admin, and it only touches
images that are unreferenced *and* past the 24h grace window. There is no
force-delete. Extending `collectReferencedUrls()` to resolve `Event.imageIds`
closes the hole before it opens.

**If a force-delete path is ever added, `imageIds` must become a join table.**

### SiteContent

`heroImage`, `aboutImage`, and each project's `coverImage` become image ids inside
the existing Json blob. `getSiteData()` gains one `image.findMany({ where: { id:
{ in: ids } } })` and returns resolved objects, so components read
`data.heroImage.url` and `data.heroImage.alt`.

### Migration

A backfill, not a rename. `Post.coverImage` may hold URLs with no `Upload` row —
external URLs, or uploads that predate the table. The migration:

1. Renames `Upload` to `Image`, adds `alt`/`caption`/`width`/`height`, makes
   `publicId` nullable.
2. Creates an `Image` row for every distinct URL in `Post.coverImage`,
   `Post.ogImage`, and the SiteContent Json that has no row yet, with
   `publicId: null`.
3. Copies `Post.coverAlt` into the matching `Image.alt`.
4. Fills `coverImageId` / `ogImageId`, rewrites the SiteContent Json.
5. Drops the old columns.

Nothing is dropped before the backfill runs.

## The events feature

`src/lib/events.ts` mirrors `src/lib/blog.ts`. `publishedEventWhere()` is the
single visibility guard, for the same reason `publishedWhere()` is — one guard, not
one per call site. Same scheduled-publish behaviour: `PUBLISHED` and `publishedAt
<= now()`, so a future `publishedAt` is a scheduled event and no cron is needed.

Public routes: `/events` and `/events/[slug]`.

Admin: `/admin/events`, `/admin/events/create`, `/admin/events/[id]/edit`, reusing
the split-pane editor layout.

One new UI primitive, `<GalleryField>`: upload through the existing `uploadImage`
action, drag to reorder, alt and caption per image.

`saveEvent` validates at the action, because the form is not a trust boundary:

- 1–10 images
- every image has a non-empty alt — a blank alt fails the save
- unique slug
- `startDate` required

Home gains `<LatestEvents>`, three most recent, a server component like
`LatestPosts` so it adds no JavaScript.

## Layout and UX

Inside the terminal identity, not replacing it.

1. **Typographic scale.** Headings, body, and metadata currently sit in a narrow
   size band, which is the main reason the page reads as templated. Introduce real
   jumps: hero display, section head, body, mono caption.
2. **Section rhythm.** Every section is `py-24`. Hero goes full-height; the rest
   alternate density.
3. **Rule-lines as structure.** `01 ── ABOUT ────────` spanning the column. The
   numbering already exists; make it load-bearing.
4. **Cards earn their hover.** Replace the border-color swap with a reveal.
5. **Motion budget.** framer-motion, GSAP, and ogl all ship today. Audit what each
   renders and cut whichever earns its bundle on only one section. Convert client
   sections to server components where the animation is not paying for itself.
6. **Nav gains `/events`** and reflects the active section.

**The contact terminal stays.** The only changes are accessibility: focus
management, `aria-live` on output so a screen reader hears responses, a visible
focus ring. Audit the current implementation first; if it already handles these,
change nothing.

## SEO, Image SEO, GEO

`Event` JSON-LD with `location: Place` → `PostalAddress` + `GeoCoordinates`,
`image[]` for the whole gallery, `organizer`, and `performer` pointing at the
existing Person `@id` so events attach to the entity already built rather than
floating free. `BreadcrumbList` on the detail page.

Sitemap gains `/events` and per-event entries listing every gallery image, not just
the cover. `generateMetadata` per event: title, description, OG image with alt,
canonical.

`/feed.xml` merges events with posts chronologically.

`/llms.txt` gains an events digest — date, venue, organizer, one-line summary. This
is the generative-engine payload: a model asked "has Afif Zilani spoken anywhere?"
reads that file in one request instead of crawling.

`Person` schema gains `homeLocation` (Naogaon, BD) as the geographic anchor.

Image SEO throughout: stored dimensions so space is reserved, enforced non-empty
alt, `sizes` on every `fill` image, gallery lazy below the fold with the cover
eager as LCP.

## Testing

Follows the existing pattern — pure functions tested, no framework beyond what is
already there (`blog.test.ts`, `uploads.test.ts`, `actions.test.ts`).

- Event image validation (1–10, alt required) as a pure function, tested directly.
- `publishedEventWhere()` covered the way `publishedWhere()` is.
- `collectReferencedUrls()` extended tests: an image referenced only by
  `Event.imageIds` must not be an orphan candidate.
- The migration backfill is verified by running it against a copy of the real data
  and diffing rendered output, not by a unit test.

## Order of work

1. Image unification: schema, migration, backfill, call-site updates.
2. Event model, `lib/events.ts`, admin CRUD, `GalleryField`.
3. Public `/events` routes and `LatestEvents`.
4. SEO / Image SEO / GEO wiring.
5. Layout and UX pass.

Phases 1–4 are the events feature. Phase 5 is the redesign, done last so it has real
content to be designed around.
