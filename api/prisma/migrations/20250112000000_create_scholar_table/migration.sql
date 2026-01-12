-- Create Scholar table if it doesn't exist, or add missing columns if it does
DO $$ 
BEGIN
  -- Check if Scholar table exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'Scholar'
  ) THEN
    -- Create the table
    CREATE TABLE "Scholar" (
      "id" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "nameArabic" TEXT,
      "title" TEXT,
      "biography" TEXT,
      "imageUrl" TEXT,
      "birthYear" INTEGER,
      "deathYear" INTEGER,
      "location" TEXT,
      "specialty" TEXT,
      "isAlive" BOOLEAN NOT NULL DEFAULT true,
      "isPublished" BOOLEAN NOT NULL DEFAULT false,
      "sortOrder" INTEGER NOT NULL DEFAULT 0,
      "createdBy" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

      CONSTRAINT "Scholar_pkey" PRIMARY KEY ("id")
    );

    -- Create indexes
    CREATE INDEX "Scholar_isPublished_idx" ON "Scholar"("isPublished");
    CREATE INDEX "Scholar_sortOrder_idx" ON "Scholar"("sortOrder");
  ELSE
    -- Table exists, add missing columns if they don't exist
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'Scholar' AND column_name = 'nameArabic'
    ) THEN
      ALTER TABLE "Scholar" ADD COLUMN "nameArabic" TEXT;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'Scholar' AND column_name = 'title'
    ) THEN
      ALTER TABLE "Scholar" ADD COLUMN "title" TEXT;
    END IF;

    -- Handle bio/biography column mismatch
    -- Check if 'bio' column exists (old schema)
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'Scholar' AND column_name = 'bio'
    ) THEN
      -- Rename 'bio' to 'biography' and make it nullable if it's NOT NULL
      DO $$
      BEGIN
        -- Check if bio is NOT NULL
        IF EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'Scholar' 
          AND column_name = 'bio' 
          AND is_nullable = 'NO'
        ) THEN
          -- Make it nullable first
          ALTER TABLE "Scholar" ALTER COLUMN "bio" DROP NOT NULL;
        END IF;
        -- Rename to biography
        ALTER TABLE "Scholar" RENAME COLUMN "bio" TO "biography";
      END $$;
    ELSIF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'Scholar' AND column_name = 'biography'
    ) THEN
      -- Add biography column if neither bio nor biography exists
      ALTER TABLE "Scholar" ADD COLUMN "biography" TEXT;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'Scholar' AND column_name = 'imageUrl'
    ) THEN
      ALTER TABLE "Scholar" ADD COLUMN "imageUrl" TEXT;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'Scholar' AND column_name = 'birthYear'
    ) THEN
      ALTER TABLE "Scholar" ADD COLUMN "birthYear" INTEGER;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'Scholar' AND column_name = 'deathYear'
    ) THEN
      ALTER TABLE "Scholar" ADD COLUMN "deathYear" INTEGER;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'Scholar' AND column_name = 'location'
    ) THEN
      ALTER TABLE "Scholar" ADD COLUMN "location" TEXT;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'Scholar' AND column_name = 'specialty'
    ) THEN
      ALTER TABLE "Scholar" ADD COLUMN "specialty" TEXT;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'Scholar' AND column_name = 'isAlive'
    ) THEN
      ALTER TABLE "Scholar" ADD COLUMN "isAlive" BOOLEAN NOT NULL DEFAULT true;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'Scholar' AND column_name = 'isPublished'
    ) THEN
      ALTER TABLE "Scholar" ADD COLUMN "isPublished" BOOLEAN NOT NULL DEFAULT false;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'Scholar' AND column_name = 'sortOrder'
    ) THEN
      ALTER TABLE "Scholar" ADD COLUMN "sortOrder" INTEGER NOT NULL DEFAULT 0;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'Scholar' AND column_name = 'createdBy'
    ) THEN
      ALTER TABLE "Scholar" ADD COLUMN "createdBy" TEXT;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'Scholar' AND column_name = 'createdAt'
    ) THEN
      ALTER TABLE "Scholar" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'Scholar' AND column_name = 'updatedAt'
    ) THEN
      ALTER TABLE "Scholar" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
    END IF;

    -- Create indexes if they don't exist
    IF NOT EXISTS (
      SELECT 1 FROM pg_indexes 
      WHERE tablename = 'Scholar' AND indexname = 'Scholar_isPublished_idx'
    ) THEN
      CREATE INDEX "Scholar_isPublished_idx" ON "Scholar"("isPublished");
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM pg_indexes 
      WHERE tablename = 'Scholar' AND indexname = 'Scholar_sortOrder_idx'
    ) THEN
      CREATE INDEX "Scholar_sortOrder_idx" ON "Scholar"("sortOrder");
    END IF;
  END IF;
END $$;
