#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Try to load dotenv if available
try {
  require('dotenv').config();
} catch (e) {
  // dotenv not installed, will use environment variables directly
}

console.log('🗄️  Setting up Tijaniyah Database...\n');

// Check if we're in the api directory
if (!fs.existsSync('package.json') || !fs.existsSync('prisma/schema.prisma')) {
  console.error('❌ Please run this script from the api directory');
  process.exit(1);
}

// Load .env file if it exists
if (fs.existsSync('.env')) {
  require('dotenv').config();
}

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.log('⚠️  DATABASE_URL not set.');
  console.log('   The .env file should contain the Neon database connection string.\n');
  
  // Create .env file with Neon database
  const envExample = `# Neon PostgreSQL Database (Shared for all environments)
DATABASE_URL="postgresql://neondb_owner:npg_Dq3XziHrt4xM@ep-broad-queen-ahyn14aw-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"

# Application Configuration
NODE_ENV=development
PORT=3000

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=*

# API Configuration
API_URL=http://localhost:3000`;

  if (!fs.existsSync('.env')) {
    fs.writeFileSync('.env', envExample);
    console.log('✅ Created .env file with Neon database configuration');
    console.log('   Using shared Neon database for all environments\n');
    // Try to reload .env
    try {
      require('dotenv').config();
    } catch (e) {
      // dotenv not available, but file created
    }
  } else {
    console.log('⚠️  .env file exists but DATABASE_URL is not set');
    console.log('   Please add DATABASE_URL to your .env file and run this script again');
    console.log('   Expected format:');
    console.log('   DATABASE_URL="postgresql://neondb_owner:npg_Dq3XziHrt4xM@ep-broad-queen-ahyn14aw-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"');
    process.exit(1);
  }
}

try {
  console.log('1️⃣  Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed\n');

  console.log('2️⃣  Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated\n');

  console.log('3️⃣  Running database migrations...');
  if (process.env.NODE_ENV === 'production') {
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    console.log('✅ Production migrations applied\n');
  } else {
    execSync('npx prisma migrate dev --name init', { stdio: 'inherit' });
    console.log('✅ Development migrations applied\n');
  }

  console.log('4️⃣  Verifying database connection...');
  execSync('npx prisma db push', { stdio: 'inherit' });
  console.log('✅ Database connection verified\n');

  console.log('🎉 Database setup completed successfully!');
  console.log('\n📋 Next steps:');
  console.log('   1. Start the API server: npm run start:dev');
  console.log('   2. Test the API endpoints');
  console.log('   3. Verify data persistence across app restarts');
  console.log('\n🔗 Useful commands:');
  console.log('   - View database: npx prisma studio');
  console.log('   - Generate client: npx prisma generate');
  console.log('\n⚠️  WARNING: Database reset commands will DELETE ALL USER DATA!');
  console.log('   - NEVER run "npm run db:reset" in production');
  console.log('   - User data is preserved by default in all operations');

} catch (error) {
  console.error('❌ Database setup failed:', error.message);
  console.log('\n🔧 Troubleshooting:');
  console.log('   1. Check your DATABASE_URL is correct');
  console.log('   2. Ensure your database server is running');
  console.log('   3. Verify database credentials');
  console.log('   4. Check network connectivity');
  process.exit(1);
}
