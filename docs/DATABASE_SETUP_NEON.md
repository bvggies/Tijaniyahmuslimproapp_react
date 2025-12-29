# Neon Database Setup

## ⚠️ PERMANENT DATABASE

**This is the PERMANENT database for this project. This connection string must be used for ALL future endeavors. DO NOT CHANGE.**

See [PERMANENT_DATABASE.md](./PERMANENT_DATABASE.md) for complete details.

This project uses a **shared Neon PostgreSQL database** for all environments (local development, testing, and production).

## Database Connection

**PERMANENT Connection String (DO NOT CHANGE):**
```
postgresql://neondb_owner:npg_Dq3XziHrt4xM@ep-broad-queen-ahyn14aw-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
```

This is a **pooled connection string** (indicated by `-pooler` in the hostname), which is optimized for serverless functions on Vercel.

## Initial Setup

### 1. Create `.env` File

In the `api/` directory, create a `.env` file with the following content:

```bash
# Neon PostgreSQL Database (Shared for all environments)
DATABASE_URL="postgresql://neondb_owner:npg_Dq3XziHrt4xM@ep-broad-queen-ahyn14aw-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"

# Application Configuration
NODE_ENV=development
PORT=3000

# JWT Configuration
# Generate a secure secret: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=*

# API Configuration
API_URL=http://localhost:3000
```

### 2. Install Dependencies

```bash
cd api
npm install
```

### 3. Generate Prisma Client

```bash
npm run db:generate
```

### 4. Run Database Migrations

```bash
# For initial setup
npm run db:deploy

# Or use the setup script
npm run db:setup
```

## Using the Database

### Local Development

The `.env` file in the `api/` directory will be automatically loaded when you run:

```bash
npm run start:dev
```

### Testing

The same database connection string is used for testing. Make sure your `.env` file is set up before running tests.

### Production (Vercel)

When deploying to Vercel, set the `DATABASE_URL` environment variable in the Vercel dashboard:

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add `DATABASE_URL` with the same connection string:
   ```
   postgresql://neondb_owner:npg_Dq3XziHrt4xM@ep-broad-queen-ahyn14aw-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
   ```

## Database Management

### View Database (Prisma Studio)

```bash
cd api
npm run db:studio
```

This will open Prisma Studio in your browser where you can view and edit data.

### Run Migrations

```bash
# Development (creates migration files)
npm run db:migrate

# Production (applies migrations without creating files)
npm run db:deploy
```

### Reset Database

⚠️ **Warning**: This will delete all data!

```bash
npm run db:reset
```

## Connection Details

- **Database Type**: PostgreSQL (Neon)
- **Connection Type**: Pooled (optimized for serverless)
- **SSL**: Required (`sslmode=require`)
- **Region**: US East 1 (AWS)
- **Shared Across**: Local, Testing, Production

## Important Notes

1. **Shared Database**: All environments use the same database. Be careful when testing to avoid affecting production data.

2. **Connection Pooling**: The connection string uses Neon's connection pooler (`-pooler` in hostname), which is essential for serverless functions on Vercel.

3. **SSL Required**: The connection requires SSL (`sslmode=require`). This is already included in the connection string.

4. **Environment Variables**: The `DATABASE_URL` in your `.env` file will be used automatically. For Vercel, you need to set it in the dashboard.

## Troubleshooting

### Connection Timeout

If you experience connection timeouts:
- Ensure you're using the **pooled connection string** (with `-pooler`)
- Check your internet connection
- Verify the connection string is correct

### Migration Errors

If migrations fail:
```bash
# Reset and re-run migrations
npm run db:reset
npm run db:deploy
```

### Prisma Client Not Generated

```bash
# Manually generate Prisma client
npm run db:generate
```

### Environment Variables Not Loading

Make sure:
1. `.env` file exists in the `api/` directory
2. `dotenv` package is installed: `npm install dotenv --save-dev`
3. You're running commands from the `api/` directory

## Security Notes

⚠️ **Important**: 
- The `.env` file is in `.gitignore` and should **never** be committed
- The connection string contains credentials - keep it secure
- For production, use Vercel's environment variables, not the `.env` file
- Consider rotating the database password periodically

## Next Steps

After setting up the database:

1. ✅ Verify connection: `npm run db:setup`
2. ✅ Start development server: `npm run start:dev`
3. ✅ Test API endpoints
4. ✅ Deploy to Vercel with the same `DATABASE_URL`

---

**Last Updated**: 2025-01-27

