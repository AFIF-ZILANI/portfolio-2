-- Unify every image into one table, and add Event.
--
-- Hand-written rather than generated: the generated version drops "Upload" and
-- the Post image columns outright, which loses data. This renames in place and
-- backfills before anything is dropped.
--
-- Post is empty in development, but production may not be, so the Post backfill
-- runs regardless. Every step is idempotent-safe on its own terms.

-- 1. Upload becomes Image, keeping its rows.
ALTER TABLE "Upload" RENAME TO "Image";

ALTER INDEX "Upload_pkey" RENAME TO "Image_pkey";
ALTER INDEX "Upload_publicId_key" RENAME TO "Image_publicId_key";
ALTER INDEX "Upload_url_key" RENAME TO "Image_url_key";
ALTER INDEX "Upload_createdAt_idx" RENAME TO "Image_createdAt_idx";

ALTER TABLE "Image" ADD COLUMN "alt" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Image" ADD COLUMN "caption" TEXT;
ALTER TABLE "Image" ADD COLUMN "width" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Image" ADD COLUMN "height" INTEGER NOT NULL DEFAULT 0;

-- Assets Cloudinary does not own (static files, external URLs) have no publicId.
ALTER TABLE "Image" ALTER COLUMN "publicId" DROP NOT NULL;

-- 2. Give Post its foreign keys, but do not drop the old columns yet.
ALTER TABLE "Post" ADD COLUMN "coverImageId" TEXT;
ALTER TABLE "Post" ADD COLUMN "ogImageId" TEXT;

-- 3. Every image URL referenced anywhere gets an Image row.
--
-- Ids are derived from the URL so re-running produces the same row rather than a
-- duplicate. Existing rows win: ON CONFLICT leaves an uploaded image's real
-- publicId and bytes intact.
INSERT INTO "Image" ("id", "url", "alt", "publicId", "bytes", "createdAt")
SELECT 'img' || substr(md5(src.url), 1, 22), src.url, COALESCE(src.alt, ''), NULL, 0, now()
FROM (
    SELECT "coverImage" AS url, "coverAlt" AS alt FROM "Post" WHERE "coverImage" IS NOT NULL AND "coverImage" <> ''
    UNION
    SELECT "ogImage", NULL FROM "Post" WHERE "ogImage" IS NOT NULL AND "ogImage" <> ''
    UNION
    SELECT data->>'heroImage', 'Afif Zilani (Kazi Afif Zilani) — Full-Stack Developer and Co-Founder of ZeroD, Naogaon, Bangladesh' FROM "SiteContent" WHERE data->>'heroImage' IS NOT NULL AND data->>'heroImage' <> ''
    UNION
    SELECT data->>'aboutImage', 'Kazi Afif Zilani (AFIF ZILANI) — Entrepreneur and Full-Stack Developer from Naogaon, Bangladesh' FROM "SiteContent" WHERE data->>'aboutImage' IS NOT NULL AND data->>'aboutImage' <> ''
    UNION
    SELECT p->>'coverImage', (p->>'title') || ' — project by Afif Zilani'
    FROM "SiteContent", jsonb_array_elements(data->'projects') AS p
    WHERE p->>'coverImage' IS NOT NULL AND p->>'coverImage' <> ''
) src
ON CONFLICT ("url") DO NOTHING;

-- Carry alt across for URLs that already had an Image row from an upload.
UPDATE "Image" i
SET "alt" = p."coverAlt"
FROM "Post" p
WHERE p."coverImage" = i."url" AND p."coverAlt" IS NOT NULL AND p."coverAlt" <> '' AND i."alt" = '';

-- 4. Point Post at the rows.
UPDATE "Post" p SET "coverImageId" = i."id" FROM "Image" i WHERE i."url" = p."coverImage";
UPDATE "Post" p SET "ogImageId" = i."id" FROM "Image" i WHERE i."url" = p."ogImage";

-- 5. Rewrite SiteContent to hold ids instead of URLs.
UPDATE "SiteContent" sc
SET data = (
    jsonb_set(
        jsonb_set(
            sc.data,
            '{heroImageId}',
            to_jsonb(COALESCE((SELECT i."id" FROM "Image" i WHERE i."url" = sc.data->>'heroImage'), ''))
        ),
        '{aboutImageId}',
        to_jsonb(COALESCE((SELECT i."id" FROM "Image" i WHERE i."url" = sc.data->>'aboutImage'), ''))
    )
    || jsonb_build_object('projects', COALESCE((
        SELECT jsonb_agg(
            (p - 'coverImage') || jsonb_build_object(
                'coverImageId',
                COALESCE((SELECT i."id" FROM "Image" i WHERE i."url" = p->>'coverImage'), '')
            )
            ORDER BY ord
        )
        FROM jsonb_array_elements(sc.data->'projects') WITH ORDINALITY AS t(p, ord)
    ), '[]'::jsonb))
) - 'heroImage' - 'aboutImage';

-- 6. Now that everything is backfilled, drop the old columns.
ALTER TABLE "Post" DROP COLUMN "coverImage";
ALTER TABLE "Post" DROP COLUMN "coverAlt";
ALTER TABLE "Post" DROP COLUMN "ogImage";

-- 7. Constraints last, so the backfill above could not trip them.
ALTER TABLE "Post" ADD CONSTRAINT "Post_coverImageId_fkey"
    FOREIGN KEY ("coverImageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Post" ADD CONSTRAINT "Post_ogImageId_fkey"
    FOREIGN KEY ("ogImageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- 8. Event.
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "imageIds" TEXT[],
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "venueName" TEXT,
    "streetAddress" TEXT,
    "city" TEXT,
    "region" TEXT,
    "country" TEXT NOT NULL DEFAULT 'BD',
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "organizer" TEXT,
    "role" TEXT,
    "tags" TEXT[],
    "status" "PostStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "canonicalUrl" TEXT,
    "noindex" BOOLEAN NOT NULL DEFAULT false,
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Event_slug_key" ON "Event"("slug");
CREATE INDEX "Event_status_publishedAt_idx" ON "Event"("status", "publishedAt");
