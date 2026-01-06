-- Create News table if it doesn't exist
-- This migration ensures the News table and all columns from the Prisma schema exist in the database

-- Create NewsCategory enum if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'NewsCategory') THEN
    CREATE TYPE "NewsCategory" AS ENUM('GENERAL', 'EVENTS', 'ANNOUNCEMENTS', 'UPDATES');
  END IF;
END $$;

-- Create NewsPriority enum if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'NewsPriority') THEN
    CREATE TYPE "NewsPriority" AS ENUM('LOW', 'MEDIUM', 'HIGH');
  END IF;
END $$;

-- Create News table if it doesn't exist
CREATE TABLE IF NOT EXISTS "News" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "excerpt" TEXT,
  "imageUrl" TEXT,
  "category" "NewsCategory" NOT NULL DEFAULT 'GENERAL',
  "priority" "NewsPriority" NOT NULL DEFAULT 'MEDIUM',
  "isPublished" BOOLEAN NOT NULL DEFAULT false,
  "isFeatured" BOOLEAN NOT NULL DEFAULT false,
  "viewCount" INTEGER NOT NULL DEFAULT 0,
  "createdBy" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

-- Add missing columns if table exists but columns are missing
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'News') THEN
    -- Ensure excerpt exists (nullable text)
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'News' AND column_name = 'excerpt'
    ) THEN
      ALTER TABLE "News" ADD COLUMN "excerpt" TEXT;
    END IF;

    -- Ensure imageUrl exists (nullable text)
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'News' AND column_name = 'imageUrl'
    ) THEN
      ALTER TABLE "News" ADD COLUMN "imageUrl" TEXT;
    END IF;

    -- Ensure category exists with default
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'News' AND column_name = 'category'
    ) THEN
      ALTER TABLE "News" ADD COLUMN "category" "NewsCategory" NOT NULL DEFAULT 'GENERAL';
    END IF;

    -- Ensure priority exists with default
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'News' AND column_name = 'priority'
    ) THEN
      ALTER TABLE "News" ADD COLUMN "priority" "NewsPriority" NOT NULL DEFAULT 'MEDIUM';
    END IF;

    -- Ensure isPublished exists (boolean, default false)
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'News' AND column_name = 'isPublished'
    ) THEN
      ALTER TABLE "News" ADD COLUMN "isPublished" BOOLEAN NOT NULL DEFAULT false;
    END IF;

    -- Ensure isFeatured exists (boolean, default false)
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'News' AND column_name = 'isFeatured'
    ) THEN
      ALTER TABLE "News" ADD COLUMN "isFeatured" BOOLEAN NOT NULL DEFAULT false;
    END IF;

    -- Ensure viewCount exists (integer, default 0)
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'News' AND column_name = 'viewCount'
    ) THEN
      ALTER TABLE "News" ADD COLUMN "viewCount" INTEGER NOT NULL DEFAULT 0;
    END IF;

    -- Ensure createdBy exists (nullable text)
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'News' AND column_name = 'createdBy'
    ) THEN
      ALTER TABLE "News" ADD COLUMN "createdBy" TEXT;
    END IF;

    -- Ensure createdAt exists (timestamp, default now)
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'News' AND column_name = 'createdAt'
    ) THEN
      ALTER TABLE "News" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
    END IF;

    -- Ensure updatedAt exists (timestamp, updated on change)
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'News' AND column_name = 'updatedAt'
    ) THEN
      ALTER TABLE "News" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
    END IF;
  END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS "News_isPublished_createdAt_idx" ON "News"("isPublished", "createdAt");
CREATE INDEX IF NOT EXISTS "News_category_idx" ON "News"("category");
CREATE INDEX IF NOT EXISTS "News_priority_idx" ON "News"("priority");

