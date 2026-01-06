-- Create News table and all required columns
-- This migration creates the News table if it doesn't exist

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

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS "News_isPublished_createdAt_idx" ON "News"("isPublished", "createdAt");
CREATE INDEX IF NOT EXISTS "News_category_idx" ON "News"("category");
CREATE INDEX IF NOT EXISTS "News_priority_idx" ON "News"("priority");

