-- Fix database schema issues
-- 1. Add 'Prayer' to EventCategory enum (or convert existing values)
-- 2. Ensure NewsCategory table exists
-- 3. Convert News.category from enum to string if needed

-- ==========================================
-- 1. Fix EventCategory enum - Add PRAYER or convert existing values
-- ==========================================
DO $$ 
BEGIN
  -- Check if EventCategory enum exists
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'EventCategory') THEN
    -- Check if PRAYER already exists in enum
    IF NOT EXISTS (
      SELECT 1 FROM pg_enum 
      WHERE enumlabel = 'PRAYER' 
      AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'EventCategory')
    ) THEN
      -- Add PRAYER to the enum
      ALTER TYPE "EventCategory" ADD VALUE 'PRAYER';
    END IF;
    
    -- Convert any existing 'Prayer' values to 'PRAYER' (case-insensitive)
    UPDATE "Event" 
    SET category = 'PRAYER' 
    WHERE LOWER(category::text) = 'prayer' 
    AND category::text != 'PRAYER';
    
    -- If there are still invalid values, convert them to 'OTHER'
    UPDATE "Event" 
    SET category = 'OTHER' 
    WHERE category::text NOT IN ('CONFERENCE', 'SEMINAR', 'WORKSHOP', 'CELEBRATION', 'OTHER', 'PRAYER');
  END IF;
END $$;

-- ==========================================
-- 2. Ensure NewsCategory table exists
-- ==========================================
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
    
    -- Insert default categories
    INSERT INTO "NewsCategory" ("id", "name", "nameArabic", "description", "color", "icon", "isActive", "sortOrder", "createdAt", "updatedAt")
    VALUES
      ('cat_general', 'GENERAL', 'عام', 'General news and updates', '#6B7280', '📰', true, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('cat_events', 'EVENTS', 'أحداث', 'Community events and gatherings', '#3B82F6', '📅', true, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('cat_announcements', 'ANNOUNCEMENTS', 'إعلانات', 'Important announcements', '#F59E0B', '📢', true, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
      ('cat_updates', 'UPDATES', 'تحديثات', 'App and system updates', '#10B981', '🔄', true, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ON CONFLICT ("name") DO NOTHING;
  END IF;
END $$;

-- ==========================================
-- 3. Convert News.category from enum to string if needed
-- ==========================================
DO $$ 
BEGIN
  -- Check if News table exists and category column is enum type
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'News' AND column_name = 'category' 
    AND data_type = 'USER-DEFINED'
  ) THEN
    -- Convert enum values to strings
    ALTER TABLE "News" ALTER COLUMN "category" TYPE TEXT USING "category"::TEXT;
    
    -- Ensure default value is set
    ALTER TABLE "News" ALTER COLUMN "category" SET DEFAULT 'GENERAL';
    
    -- Update any NULL values to default
    UPDATE "News" SET category = 'GENERAL' WHERE category IS NULL;
  END IF;
END $$;

