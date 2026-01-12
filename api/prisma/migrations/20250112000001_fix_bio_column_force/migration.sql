-- Force fix bio/biography column issue
-- This migration ensures bio is renamed to biography and made nullable
-- It handles cases where the previous migration may have failed silently

DO $$
BEGIN
  -- Check if Scholar table exists
  IF EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'Scholar'
  ) THEN
    -- Step 1: If bio column exists, handle it
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'Scholar' AND column_name = 'bio'
    ) THEN
      RAISE NOTICE 'Found bio column, renaming to biography...';
      
      -- Make bio nullable first (required before rename)
      BEGIN
        ALTER TABLE "Scholar" ALTER COLUMN "bio" DROP NOT NULL;
        RAISE NOTICE 'Dropped NOT NULL constraint on bio';
      EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Could not drop NOT NULL on bio (may already be nullable): %', SQLERRM;
      END;
      
      -- Rename bio to biography
      BEGIN
        -- Check if biography already exists
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'Scholar' AND column_name = 'biography'
        ) THEN
          -- Biography exists, copy data from bio and drop bio
          RAISE NOTICE 'biography column already exists, copying data from bio...';
          UPDATE "Scholar" SET "biography" = "bio" WHERE "bio" IS NOT NULL AND "biography" IS NULL;
          ALTER TABLE "Scholar" DROP COLUMN "bio";
          RAISE NOTICE 'Copied data from bio to biography and dropped bio column';
        ELSE
          -- Biography doesn't exist, rename bio
          ALTER TABLE "Scholar" RENAME COLUMN "bio" TO "biography";
          RAISE NOTICE 'Renamed bio column to biography';
        END IF;
      EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Rename failed: %, trying alternative approach', SQLERRM;
        
        -- Alternative: Create biography, copy data, drop bio
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'Scholar' AND column_name = 'biography'
        ) THEN
          ALTER TABLE "Scholar" ADD COLUMN "biography" TEXT;
          UPDATE "Scholar" SET "biography" = "bio" WHERE "bio" IS NOT NULL;
          
          -- Try to drop bio column
          BEGIN
            ALTER TABLE "Scholar" DROP COLUMN "bio";
          EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Could not drop bio column: %', SQLERRM;
          END;
        END IF;
      END;
    END IF;
    
    -- Step 2: Ensure biography column exists and is nullable
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'Scholar' AND column_name = 'biography'
    ) THEN
      ALTER TABLE "Scholar" ADD COLUMN "biography" TEXT;
      RAISE NOTICE 'Added biography column';
    END IF;
    
    -- Ensure biography is nullable
    BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Scholar' 
        AND column_name = 'biography' 
        AND is_nullable = 'NO'
      ) THEN
        ALTER TABLE "Scholar" ALTER COLUMN "biography" DROP NOT NULL;
        RAISE NOTICE 'Made biography column nullable';
      END IF;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Could not ensure biography is nullable: %', SQLERRM;
    END;
    
    -- Step 3: Final verification - ensure bio column doesn't exist
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'Scholar' AND column_name = 'bio'
    ) THEN
      RAISE WARNING 'bio column still exists after migration! This may cause issues.';
    ELSE
      RAISE NOTICE 'Migration completed successfully - bio column removed, biography column exists';
    END IF;
  ELSE
    RAISE NOTICE 'Scholar table does not exist, skipping migration';
  END IF;
END $$;
