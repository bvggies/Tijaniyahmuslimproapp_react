# Database Setup Guide

## Overview
This application uses PostgreSQL with Prisma ORM for both development and production environments. All data is stored in a real database, not local storage.

## Database Configuration

### 1. Environment Variables
Create the following environment files:

#### For Development (`api/.env.development`):
```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/tijaniyah_dev?schema=public"

# Application Configuration
NODE_ENV=development
PORT=3000

# JWT Configuration
JWT_SECRET=dev-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=*

# API Configuration
API_URL=http://localhost:3000
```

#### For Production (`api/.env.production`):
```env
# Database Configuration
DATABASE_URL="postgresql://username:password@your-production-host:5432/tijaniyah_prod?schema=public"

# Application Configuration
NODE_ENV=production
PORT=3000

# JWT Configuration
JWT_SECRET=your-super-secure-production-jwt-secret
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=https://your-frontend-domain.com

# API Configuration
API_URL=https://your-api-domain.com
```

### 2. Database Setup Commands

#### Install Dependencies
```bash
cd api
npm install
```

#### Generate Prisma Client
```bash
npx prisma generate
```

#### Run Database Migrations
```bash
# For development
npx prisma migrate dev

# For production
npx prisma migrate deploy
```

#### Reset Database (Development Only)
```bash
npx prisma migrate reset
```

### 3. Database Schema
The application uses the following main entities:
- **User**: User accounts with authentication
- **CommunityPost**: Community posts and discussions
- **CommunityComment**: Comments on posts
- **CommunityLike**: Likes on posts
- **JournalEntry**: Personal journal entries
- **Conversation**: Chat conversations
- **Message**: Chat messages

### 4. Production Database Options

#### Option 1: Railway (Current)
- Already configured for Railway deployment
- Uses Railway's PostgreSQL service
- Environment variables set in Railway dashboard

#### Option 2: Neon Database
- Free tier available
- PostgreSQL-compatible
- Easy setup and scaling

#### Option 3: Supabase
- Free tier available
- PostgreSQL with additional features
- Built-in authentication (optional)

#### Option 4: Self-hosted PostgreSQL
- Install PostgreSQL on your server
- Configure connection string
- Set up SSL certificates

### 5. Development Database Setup

#### Local PostgreSQL Installation
1. Install PostgreSQL locally
2. Create database: `createdb tijaniyah_dev`
3. Update DATABASE_URL in `.env.development`
4. Run migrations: `npx prisma migrate dev`

#### Docker PostgreSQL (Alternative)
```bash
# Run PostgreSQL in Docker
docker run --name tijaniyah-postgres \
  -e POSTGRES_DB=tijaniyah_dev \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15

# Update DATABASE_URL
DATABASE_URL="postgresql://postgres:password@localhost:5432/tijaniyah_dev?schema=public"
```

### 6. Data Persistence
- All user data is stored in the database
- Authentication tokens are stored in AsyncStorage (client-side)
- User sessions persist across app restarts
- No data loss between builds

### 7. Backup and Recovery
- Regular database backups recommended
- Use `pg_dump` for PostgreSQL backups
- Test restore procedures regularly

### 8. Monitoring and Maintenance
- Monitor database performance
- Regular cleanup of old data
- Index optimization
- Connection pool management

## Current Status
✅ Database schema defined with Prisma
✅ PostgreSQL configured for production (Railway)
✅ Authentication system using real database
✅ All user data persisted in database
✅ No local storage dependency for critical data

## Next Steps
1. Set up development database
2. Configure environment variables
3. Run database migrations
4. Test data persistence
5. Verify authentication works across builds
