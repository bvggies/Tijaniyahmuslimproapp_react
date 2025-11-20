#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🗄️  Setting up Tijaniyah Database...\n');

// Check if we're in the api directory
if (!fs.existsSync('package.json') || !fs.existsSync('prisma/schema.prisma')) {
  console.error('❌ Please run this script from the api directory');
  process.exit(1);
}

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.log('⚠️  DATABASE_URL not set. Please set your database URL:');
  console.log('   For development: postgresql://username:password@localhost:5432/tijaniyah_dev');
  console.log('   For production: your production database URL\n');
  
  // Create example .env file
  const envExample = `# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/tijaniyah_dev?schema=public"

# Application Configuration
NODE_ENV=development
PORT=3000

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=*

# API Configuration
API_URL=http://localhost:3000`;

  if (!fs.existsSync('.env')) {
    fs.writeFileSync('.env', envExample);
    console.log('✅ Created .env file with example configuration');
    console.log('   Please update the DATABASE_URL with your actual database credentials\n');
  }
  
  console.log('Please set DATABASE_URL environment variable and run this script again');
  process.exit(1);
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
  console.log('   - Reset database: npx prisma migrate reset');
  console.log('   - Generate client: npx prisma generate');

} catch (error) {
  console.error('❌ Database setup failed:', error.message);
  console.log('\n🔧 Troubleshooting:');
  console.log('   1. Check your DATABASE_URL is correct');
  console.log('   2. Ensure your database server is running');
  console.log('   3. Verify database credentials');
  console.log('   4. Check network connectivity');
  process.exit(1);
}
