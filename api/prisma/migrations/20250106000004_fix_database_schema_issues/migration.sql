-- Fix database schema issues
-- 1. Add 'Prayer' to EventCategory enum (or convert existing values)
-- 2. Convert News.category from enum to string if needed (must happen before creating NewsCategory table)
-- 3. Drop NewsCategory enum if it exists (after converting News.category)
-- 4. Ensure NewsCategory table exists

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
-- 2. Convert News.category from enum to string if needed (MUST happen first)
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

-- ==========================================
-- 3. Drop NewsCategory enum if it exists (after News.category is converted)
-- ==========================================
DO $$ 
BEGIN
  -- Check if NewsCategory enum exists
  IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'NewsCategory') THEN
    -- After converting News.category to TEXT, the enum should no longer be in use
    -- Drop it so we can create the NewsCategory table
    -- Use CASCADE to handle any remaining dependencies (shouldn't be any after step 2)
    BEGIN
      DROP TYPE "NewsCategory" CASCADE;
    EXCEPTION WHEN OTHERS THEN
      -- If drop fails, it means something is still using the enum
      -- This shouldn't happen if step 2 completed successfully
      RAISE EXCEPTION 'Cannot drop NewsCategory enum: %. Please ensure News.category has been converted to TEXT.', SQLERRM;
    END;
  END IF;
END $$;

-- ==========================================
-- 4. Ensure NewsCategory table exists (now safe to create)
-- ==========================================
DO $$ 
BEGIN
  -- Check for table existence (not enum)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'NewsCategory'
  ) THEN
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

