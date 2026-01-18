#!/usr/bin/env node

/**
 * Migration script with retry logic for Vercel deployments
 * Handles timeout issues and concurrent migration attempts
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const MAX_RETRIES = 3;
const RETRY_DELAY = 5000; // 5 seconds
const MIGRATION_TIMEOUT = 30000; // 30 seconds

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function runCommand(command, description) {
  try {
    console.log(`\n🔄 ${description}...`);
    const output = execSync(command, {
      encoding: 'utf-8',
      stdio: 'inherit',
      timeout: MIGRATION_TIMEOUT,
      env: {
        ...process.env,
        // Increase Prisma timeout
        PRISMA_MIGRATE_TIMEOUT: '30000',
      },
    });
    return { success: true, output };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function checkMigrationStatus() {
  console.log('\n📊 Checking migration status...');
  const result = runCommand('npx prisma migrate status', 'Checking migration status');
  
  if (!result.success) {
    // If status check fails, it might mean migrations need to be applied
    console.log('⚠️  Migration status check failed, will attempt to apply migrations');
    return 'unknown';
  }
  
  // Check if output indicates migrations are up to date
  if (result.output && result.output.includes('Database schema is up to date')) {
    return 'up-to-date';
  }
  
  return 'pending';
}

async function runMigrationsWithRetry() {
  console.log('\n🚀 Starting database migrations with retry logic...');
  
  // First, check if migrations are already applied
  const status = await checkMigrationStatus();
  if (status === 'up-to-date') {
    console.log('✅ Database schema is already up to date, skipping migrations');
    return true;
  }
  
  // Try to apply migrations with retries
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    console.log(`\n📦 Migration attempt ${attempt}/${MAX_RETRIES}`);
    
    // Add random delay to avoid concurrent lock conflicts
    if (attempt > 1) {
      const delay = RETRY_DELAY + Math.random() * 2000; // 5-7 seconds
      console.log(`⏳ Waiting ${Math.round(delay / 1000)}s before retry...`);
      await sleep(delay);
    }
    
    const result = runCommand(
      'npx prisma migrate deploy',
      `Applying migrations (attempt ${attempt})`
    );
    
    if (result.success) {
      console.log('✅ Migrations applied successfully!');
      return true;
    }
    
    // Check if error is due to lock timeout
    if (result.error && result.error.includes('P1002')) {
      console.log(`⚠️  Database timeout (attempt ${attempt}/${MAX_RETRIES})`);
      if (attempt < MAX_RETRIES) {
        console.log('🔄 Will retry...');
        continue;
      } else {
        console.log('❌ Max retries reached. Migration failed due to timeout.');
        console.log('💡 This might be due to concurrent deployments. Try deploying again.');
        return false;
      }
    }
    
    // Check if migrations are already applied (another deployment might have done it)
    if (result.error && (
      result.error.includes('already applied') ||
      result.error.includes('up to date') ||
      result.error.includes('No pending migrations')
    )) {
      console.log('✅ Migrations appear to be already applied (possibly by another deployment)');
      return true;
    }
    
    // Other errors
    console.log(`❌ Migration failed: ${result.error}`);
    if (attempt < MAX_RETRIES) {
      console.log('🔄 Will retry...');
    } else {
      console.log('❌ Max retries reached.');
      return false;
    }
  }
  
  return false;
}

async function generatePrismaClient() {
  console.log('\n🔧 Generating Prisma Client...');
  const result = runCommand('npx prisma generate', 'Generating Prisma Client');
  
  if (!result.success) {
    console.error('❌ Failed to generate Prisma Client');
    process.exit(1);
  }
  
  console.log('✅ Prisma Client generated successfully!');
  return true;
}

async function main() {
  console.log('🚀 Starting Vercel build process...');
  console.log('📅', new Date().toISOString());
  
  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set!');
    process.exit(1);
  }
  
  // Run migrations with retry logic
  const migrationSuccess = await runMigrationsWithRetry();
  
  if (!migrationSuccess) {
    console.log('\n⚠️  Migration failed, but continuing with build...');
    console.log('💡 The application might work if migrations were already applied.');
    console.log('💡 If you see database errors, try redeploying.');
  }
  
  // Always generate Prisma Client
  await generatePrismaClient();
  
  console.log('\n✅ Build preparation complete!');
  console.log('📦 Next: Running NestJS build...');
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
