const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixMigrationState() {
  try {
    // Check if the migration was actually applied by checking database state
    const newsCategoryTableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'NewsCategory'
      );
    `;

    const prayerEnumExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'PRAYER' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'EventCategory')
      );
    `;

    const newsCategoryIsText = await prisma.$queryRaw`
      SELECT data_type 
      FROM information_schema.columns 
      WHERE table_name = 'News' 
      AND column_name = 'category';
    `;

    const isText = newsCategoryIsText[0]?.data_type === 'text';

    console.log('Database state check:');
    console.log('- NewsCategory table exists:', newsCategoryTableExists[0].exists);
    console.log('- PRAYER enum exists:', prayerEnumExists[0].exists);
    console.log('- News.category is TEXT:', isText);

    if (newsCategoryTableExists[0].exists && prayerEnumExists[0].exists && isText) {
      console.log('\nMigration appears to be applied correctly.');
      console.log('If Vercel still shows it as failed, you may need to manually update the _prisma_migrations table.');
      console.log('\nTo fix manually, run this SQL:');
      console.log(`
        UPDATE "_prisma_migrations" 
        SET finished_at = NOW(), 
            applied_steps_count = 1,
            logs = NULL,
            rolled_back_at = NULL
        WHERE migration_name = '20250106000004_fix_database_schema_issues'
        AND finished_at IS NULL;
      `);
    } else {
      console.log('\nMigration may not be fully applied. Please check the database state.');
    }
  } catch (error) {
    console.error('Error checking migration state:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

fixMigrationState();

