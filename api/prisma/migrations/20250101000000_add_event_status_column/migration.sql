-- CreateEnum
DO $$ BEGIN
 CREATE TYPE "EventStatus" AS ENUM('UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- AlterTable
ALTER TABLE "Event" ADD COLUMN IF NOT EXISTS "status" "EventStatus" NOT NULL DEFAULT 'UPCOMING';

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Event_status_isPublished_idx" ON "Event"("status", "isPublished");
