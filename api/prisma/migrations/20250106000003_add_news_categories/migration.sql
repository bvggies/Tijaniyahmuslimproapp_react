-- Create NewsCategory table (only if it doesn't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'NewsCategory') THEN
    CREATE TABLE "NewsCategory" (
      "id" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "nameArabic" TEXT,
      "description" TEXT,
      "color" TEXT,
      "icon" TEXT,
      "isActive" BOOLEAN NOT NULL DEFAULT true,
      "sortOrder" INTEGER NOT NULL DEFAULT 0,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "NewsCategory_pkey" PRIMARY KEY ("id")
    );

    -- Create unique index on name
    CREATE UNIQUE INDEX "NewsCategory_name_key" ON "NewsCategory"("name");

    -- Create index for active categories
    CREATE INDEX "NewsCategory_isActive_sortOrder_idx" ON "NewsCategory"("isActive", "sortOrder");
  END IF;
END $$;

-- Insert default categories
INSERT INTO "NewsCategory" ("id", "name", "nameArabic", "description", "color", "icon", "isActive", "sortOrder", "createdAt", "updatedAt")
VALUES
  ('cat_general', 'GENERAL', 'عام', 'General news and updates', '#6B7280', '📰', true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cat_events', 'EVENTS', 'أحداث', 'Community events and gatherings', '#3B82F6', '📅', true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cat_announcements', 'ANNOUNCEMENTS', 'إعلانات', 'Important announcements', '#F59E0B', '📢', true, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cat_updates', 'UPDATES', 'تحديثات', 'App and system updates', '#10B981', '🔄', true, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("name") DO NOTHING;

-- Change News.category from enum to string (if it's currently using enum)
-- First, check if we need to alter the column type
DO $$ 
BEGIN
  -- Check if category column exists and is of enum type
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'News' AND column_name = 'category' 
    AND data_type = 'USER-DEFINED'
  ) THEN
    -- Convert enum values to strings
    ALTER TABLE "News" ALTER COLUMN "category" TYPE TEXT USING "category"::TEXT;
  END IF;
  
  -- Ensure default value is set
  ALTER TABLE "News" ALTER COLUMN "category" SET DEFAULT 'GENERAL';
END $$;

