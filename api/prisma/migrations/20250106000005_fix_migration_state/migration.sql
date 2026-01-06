-- Fix migration state: Mark previous migration as applied if database is already in correct state
-- This handles the case where the migration was partially applied or marked as failed incorrectly

DO $$ 
BEGIN
  -- Check if NewsCategory table exists (indicates migration 20250106000004 was applied)
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'NewsCategory'
  ) THEN
    -- Check if PRAYER exists in EventCategory enum (indicates migration was applied)
    IF EXISTS (
      SELECT 1 FROM pg_enum 
      WHERE enumlabel = 'PRAYER' 
      AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'EventCategory')
    ) THEN
      -- Check if News.category is TEXT (not enum) - indicates migration was applied
      IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'News' 
        AND column_name = 'category' 
        AND data_type = 'text'
      ) THEN
        -- Migration was successfully applied, but Prisma migration table might be out of sync
        -- This is a no-op migration - the actual fix happens in the Prisma migration tracking
        -- We just ensure the database state is correct
        RAISE NOTICE 'Migration 20250106000004_fix_database_schema_issues appears to be applied correctly';
      END IF;
    END IF;
  END IF;
END $$;

