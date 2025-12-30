#!/usr/bin/env node

/**
 * Database Reset Script
 * 
 * ⚠️ WARNING: This will DELETE ALL DATA from the database!
 * 
 * This script requires FORCE_RESET=true to proceed.
 * Use only in development/testing environments.
 * NEVER run in production.
 */

if (process.env.FORCE_RESET !== 'true') {
  console.error('❌ Database reset cancelled.');
  console.error('⚠️  WARNING: This command will DELETE ALL USER DATA!');
  console.error('');
  console.error('To proceed, set FORCE_RESET=true:');
  console.error('  Windows: set FORCE_RESET=true && npm run db:reset');
  console.error('  Linux/Mac: FORCE_RESET=true npm run db:reset');
  console.error('');
  console.error('⚠️  NEVER run this in production!');
  process.exit(1);
}

console.log('⚠️  WARNING: You are about to DELETE ALL DATA from the database!');
console.log('⚠️  This includes all users, posts, comments, and all other data.');
console.log('');
console.log('Proceeding with database reset in 3 seconds...');
console.log('Press Ctrl+C to cancel.');

setTimeout(() => {
  const { execSync } = require('child_process');
  try {
    console.log('🔄 Resetting database...');
    execSync('npx prisma migrate reset', { stdio: 'inherit' });
    console.log('✅ Database reset completed.');
  } catch (error) {
    console.error('❌ Database reset failed:', error.message);
    process.exit(1);
  }
}, 3000);

