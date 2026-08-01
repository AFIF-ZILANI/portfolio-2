-- Series was the last table still holding an image as a URL string.
-- Same backfill shape as the Post columns: create the row, point at it, then drop.

ALTER TABLE "Series" ADD COLUMN "coverImageId" TEXT;

INSERT INTO "Image" ("id", "url", "alt", "publicId", "bytes", "createdAt")
SELECT 'img' || substr(md5(s."coverImage"), 1, 22), s."coverImage", '', NULL, 0, now()
FROM "Series" s
WHERE s."coverImage" IS NOT NULL AND s."coverImage" <> ''
ON CONFLICT ("url") DO NOTHING;

UPDATE "Series" s SET "coverImageId" = i."id" FROM "Image" i WHERE i."url" = s."coverImage";

ALTER TABLE "Series" DROP COLUMN "coverImage";

ALTER TABLE "Series" ADD CONSTRAINT "Series_coverImageId_fkey"
    FOREIGN KEY ("coverImageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;
