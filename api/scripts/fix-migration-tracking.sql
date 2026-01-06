-- Fix migration tracking: Mark migration as applied if database state is correct
-- This fixes the case where migration was applied but Prisma tracking table shows it as failed

DO $$ 
BEGIN
  -- Check if migration was actually applied by verifying database state
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'NewsCategory'
  ) AND EXISTS (
    SELECT 1 FROM pg_enum 
    WHERE enumlabel = 'PRAYER' 
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'EventCategory')
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'News' 
    AND column_name = 'category' 
    AND data_type = 'text'
  ) THEN
    -- Migration was applied successfully, update tracking table
    UPDATE "_prisma_migrations" 
    SET finished_at = NOW(), 
        applied_steps_count = 1,
        logs = NULL,
        rolled_back_at = NULL
    WHERE migration_name = '20250106000004_fix_database_schema_issues'
    AND finished_at IS NULL;
    
    RAISE NOTICE 'Migration tracking updated successfully';
  ELSE
    RAISE EXCEPTION 'Migration state check failed - database may not be in expected state';
  END IF;
END $$;

