# Quick Start: Deploy to Vercel

## Prerequisites
- Vercel account
- Neon database is already configured (shared connection string)

## Quick Deploy Steps

1. **Database is Already Configured (PERMANENT)**:
   - ⚠️ **This is the PERMANENT database for this project. DO NOT CHANGE.**
   - Connection string: `postgresql://neondb_owner:npg_Dq3XziHrt4xM@ep-broad-queen-ahyn14aw-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require`
   - See [docs/PERMANENT_DATABASE.md](../docs/PERMANENT_DATABASE.md) for complete details

2. **Deploy to Vercel**:
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Navigate to api folder
   cd api
   
   # Login to Vercel
   vercel login
   
   # Link project
   vercel link
   
   # Set environment variables
   vercel env add DATABASE_URL
   # Enter: postgresql://neondb_owner:npg_Dq3XziHrt4xM@ep-broad-queen-ahyn14aw-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
   
   vercel env add JWT_SECRET
   # Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   
   vercel env add CORS_ORIGIN
   # Enter your frontend URL or "*"
   
   # Deploy
   vercel --prod
   ```

3. **Run Database Migrations**:
   ```bash
   # Pull env vars locally
   vercel env pull .env.local
   
   # Run migrations
   npm run db:deploy
   ```

4. **Update Frontend**:
   Update `src/services/api.ts` with your Vercel URL:
   ```typescript
   export const API_URL = 'https://your-project.vercel.app';
   ```

## Environment Variables

Required in Vercel dashboard:
- `DATABASE_URL` - `postgresql://neondb_owner:npg_Dq3XziHrt4xM@ep-broad-queen-ahyn14aw-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require`
- `JWT_SECRET` - Random 32+ character string (generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- `CORS_ORIGIN` - Your frontend URL (or "*")

## Testing

```bash
# Health check
curl https://your-project.vercel.app/health

# Test signup
curl -X POST https://your-project.vercel.app/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test"}'
```

For detailed instructions, see [docs/VERCEL_DEPLOYMENT.md](../docs/VERCEL_DEPLOYMENT.md)

