-- Add missing columns to Event table if they don't exist
-- This migration ensures all columns from the Prisma schema exist in the database

-- Create EventCategory enum if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'EventCategory') THEN
    CREATE TYPE "EventCategory" AS ENUM('CONFERENCE', 'SEMINAR', 'WORKSHOP', 'CELEBRATION', 'OTHER');
  END IF;
END $$;

-- Create EventStatus enum if it doesn't exist (should already exist from previous migration)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'EventStatus') THEN
    CREATE TYPE "EventStatus" AS ENUM('UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED');
  END IF;
END $$;

-- Add maxAttendees column (nullable integer) - using quoted identifier to match Prisma
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'Event' AND column_name = 'maxAttendees'
  ) THEN
    ALTER TABLE "Event" ADD COLUMN "maxAttendees" INTEGER;
  END IF;
END $$;

-- Add registrationRequired column (boolean, default false)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'Event' AND column_name = 'registrationRequired'
  ) THEN
    ALTER TABLE "Event" ADD COLUMN "registrationRequired" BOOLEAN NOT NULL DEFAULT false;
  END IF;
END $$;

-- Ensure imageUrl exists (nullable text)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'Event' AND column_name = 'imageUrl'
  ) THEN
    ALTER TABLE "Event" ADD COLUMN "imageUrl" TEXT;
  END IF;
END $$;

-- Ensure category exists with default
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'Event' AND column_name = 'category'
  ) THEN
    ALTER TABLE "Event" ADD COLUMN "category" "EventCategory" NOT NULL DEFAULT 'OTHER';
  END IF;
END $$;

-- Ensure status exists (should already exist from previous migration, but check anyway)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'Event' AND column_name = 'status'
  ) THEN
    ALTER TABLE "Event" ADD COLUMN "status" "EventStatus" NOT NULL DEFAULT 'UPCOMING';
  END IF;
END $$;

-- Ensure isPublished exists (boolean, default false)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'Event' AND column_name = 'isPublished'
  ) THEN
    ALTER TABLE "Event" ADD COLUMN "isPublished" BOOLEAN NOT NULL DEFAULT false;
  END IF;
END $$;

-- Ensure createdBy exists (nullable text)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'Event' AND column_name = 'createdBy'
  ) THEN
    ALTER TABLE "Event" ADD COLUMN "createdBy" TEXT;
  END IF;
END $$;

-- Ensure createdAt exists (timestamp, default now)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'Event' AND column_name = 'createdAt'
  ) THEN
    ALTER TABLE "Event" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
  END IF;
END $$;

-- Ensure updatedAt exists (timestamp, updated on change)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'Event' AND column_name = 'updatedAt'
  ) THEN
    ALTER TABLE "Event" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
  END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS "Event_startDate_idx" ON "Event"("startDate");
CREATE INDEX IF NOT EXISTS "Event_category_idx" ON "Event"("category");
CREATE INDEX IF NOT EXISTS "Event_status_isPublished_idx" ON "Event"("status", "isPublished");

