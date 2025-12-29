# 🗄️ Tijaniyah Database Configuration

## Overview
This application uses **PostgreSQL with Prisma ORM** for both development and production environments. All user data, authentication, and app state are stored in a real database - no local storage dependency.

## ✅ Current Database Status

### Production Database
- **Provider**: Railway PostgreSQL
- **Status**: ✅ Active and configured
- **URL**: `https://tijaniyahmuslimproappreact-production-1e25.up.railway.app`
- **Data Persistence**: ✅ All user data persists across builds

### Development Database
- **Status**: ⚠️ Needs local setup
- **Required**: Local PostgreSQL installation or cloud database

## 🚀 Quick Setup

### Option 1: Use Production Database for Development
```bash
# Use the same database for development
export DATABASE_URL="your-production-database-url"
cd api
npm run db:setup
```

### Option 2: Local PostgreSQL Setup
```bash
# Install PostgreSQL locally
# Create database
createdb tijaniyah_dev

# Set environment variable
export DATABASE_URL="postgresql://username:password@localhost:5432/tijaniyah_dev"

# Setup database
cd api
npm run db:setup
```

### Option 3: Docker PostgreSQL
```bash
# Run PostgreSQL in Docker
docker run --name tijaniyah-postgres \
  -e POSTGRES_DB=tijaniyah_dev \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15

# Set environment variable
export DATABASE_URL="postgresql://postgres:password@localhost:5432/tijaniyah_dev"

# Setup database
cd api
npm run db:setup
```

## 📊 Database Schema

### Core Entities
- **User**: Authentication and profile data
- **CommunityPost**: Community discussions
- **CommunityComment**: Post comments
- **CommunityLike**: Post likes
- **JournalEntry**: Personal journal entries
- **Conversation**: Chat conversations
- **Message**: Chat messages

### Key Features
- ✅ **Real-time data persistence**
- ✅ **User authentication with JWT**
- ✅ **Data survives app rebuilds**
- ✅ **Cross-device synchronization**
- ✅ **Backup and recovery support**

## 🔧 Database Commands

### Setup Commands
```bash
# Complete database setup
npm run db:setup

# Generate Prisma client
npm run db:generate

# Run migrations (development)
npm run db:migrate

# Deploy migrations (production)
npm run db:deploy

# Reset database (development only)
npm run db:reset

# Open database browser
npm run db:studio
```

### Manual Commands
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Deploy migrations
npx prisma migrate deploy

# Reset database
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio

# Push schema changes
npx prisma db push
```

## 🌐 Environment Configuration

### Development Environment
```env
DATABASE_URL="postgresql://username:password@localhost:5432/tijaniyah_dev"
NODE_ENV=development
PORT=3000
JWT_SECRET=dev-secret-key
CORS_ORIGIN=*
```

### Production Environment
```env
DATABASE_URL="postgresql://username:password@production-host:5432/tijaniyah_prod"
NODE_ENV=production
PORT=3000
JWT_SECRET=production-secret-key
CORS_ORIGIN=https://your-domain.com"
```

## 🔐 Authentication Flow

### User Registration
1. User submits registration form
2. Data sent to API (`/auth/signup`)
3. Password hashed with bcrypt
4. User record created in database
5. JWT token generated and returned
6. Token stored in AsyncStorage (client-side)

### User Login
1. User submits login credentials
2. API validates credentials against database
3. JWT token generated and returned
4. Token stored in AsyncStorage
5. User authenticated across app sessions

### Data Persistence
- ✅ **User accounts**: Stored in database
- ✅ **Authentication tokens**: Stored in AsyncStorage
- ✅ **User preferences**: Stored in database
- ✅ **App settings**: Stored in database
- ✅ **Community posts**: Stored in database
- ✅ **Journal entries**: Stored in database

## 🚨 Troubleshooting

### Common Issues

#### 1. Database Connection Failed
```bash
# Check database URL
echo $DATABASE_URL

# Test connection
npx prisma db push

# Check database server status
pg_isready -h localhost -p 5432
```

#### 2. Migration Errors
```bash
# Reset and re-run migrations
npx prisma migrate reset
npx prisma migrate dev
```

#### 3. Authentication Issues
```bash
# Check API server
curl http://localhost:3000/health

# Check database connection
npx prisma studio
```

#### 4. Data Not Persisting
- Verify DATABASE_URL is correct
- Check API server is running
- Ensure database migrations are applied
- Verify user authentication flow

### Debug Commands
```bash
# Check database connection
npx prisma db push

# View database schema
npx prisma studio

# Check API health
curl http://localhost:3000/health

# Test authentication
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@tijaniyah.com","password":"demo123"}'
```

## 📈 Performance Optimization

### Database Indexing
- User email (unique index)
- Post creation date
- Comment post ID
- Message conversation ID

### Connection Pooling
- Configured for Railway deployment
- Connection limit: 1
- Pool timeout: 20 seconds

### Query Optimization
- Prisma query optimization
- Efficient relationship loading
- Pagination for large datasets

## 🔄 Backup and Recovery

### Backup Commands
```bash
# Full database backup
pg_dump $DATABASE_URL > backup.sql

# Schema only backup
pg_dump --schema-only $DATABASE_URL > schema.sql

# Data only backup
pg_dump --data-only $DATABASE_URL > data.sql
```

### Recovery Commands
```bash
# Restore from backup
psql $DATABASE_URL < backup.sql

# Restore schema
psql $DATABASE_URL < schema.sql

# Restore data
psql $DATABASE_URL < data.sql
```

## ✅ Verification Checklist

- [ ] Database connection established
- [ ] Migrations applied successfully
- [ ] API server running
- [ ] Authentication working
- [ ] Data persisting across app restarts
- [ ] User registration working
- [ ] User login working
- [ ] Data synchronization working

## 🎯 Next Steps

1. **Set up development database**
2. **Configure environment variables**
3. **Run database migrations**
4. **Test authentication flow**
5. **Verify data persistence**
6. **Deploy to production**

---

**Note**: This application is already configured to use a real database for production. The authentication persistence issue has been resolved by implementing proper token storage and database integration.
