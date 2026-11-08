-- Pinned events lead the homepage Events section. Existing rows stay unpinned.
ALTER TABLE "Event" ADD COLUMN "pinned" BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX "Event_pinned_startDate_idx" ON "Event"("pinned", "startDate");
