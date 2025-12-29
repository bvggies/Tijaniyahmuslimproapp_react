# Deploying Backend to Vercel with Neon PostgreSQL

> **📖 For a detailed step-by-step guide, see [VERCEL_DEPLOYMENT_STEP_BY_STEP.md](./VERCEL_DEPLOYMENT_STEP_BY_STEP.md)**

This guide provides an overview of deploying the NestJS backend API to Vercel with the permanent Neon PostgreSQL database.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Neon Account**: Sign up at [neon.tech](https://neon.tech)
3. **Vercel CLI** (optional): `npm i -g vercel`
4. **Git Repository**: Your code should be in a Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Database Configuration

## ⚠️ PERMANENT DATABASE

**This is the PERMANENT database for this project. This connection string must be used for ALL deployments and future work. DO NOT CHANGE.**

See [PERMANENT_DATABASE.md](./PERMANENT_DATABASE.md) for complete details.

This project uses a **shared Neon PostgreSQL database** for all environments.

**PERMANENT Connection String (DO NOT CHANGE):**
```
postgresql://neondb_owner:npg_Dq3XziHrt4xM@ep-broad-queen-ahyn14aw-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
```

This is a **pooled connection string** (optimized for serverless functions).

**Run Database Migrations Locally:**
```bash
cd api
# Create .env file with DATABASE_URL (see api/ENV_SETUP.md)
npm run db:deploy
```

See [DATABASE_SETUP_NEON.md](./DATABASE_SETUP_NEON.md) for detailed database setup instructions.

## Step 2: Configure Vercel Project

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Import Project**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your Git repository
   - Select the repository containing your code

2. **Configure Project Settings**:
   - **Root Directory**: Set to `api` (since your backend is in the `api` folder)
   - **Framework Preset**: Select "Other" or "Node.js"
   - **Build Command**: `npm run vercel-build` or `npm run build`
   - **Output Directory**: Leave empty (not needed for serverless)
   - **Install Command**: `npm install`

3. **Environment Variables**:
   Add these in the Vercel dashboard under Settings → Environment Variables:
   
   | Variable | Value | Description |
   |----------|-------|-------------|
   | `DATABASE_URL` | `postgresql://neondb_owner:npg_Dq3XziHrt4xM@ep-broad-queen-ahyn14aw-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require` | Shared Neon PostgreSQL connection |
   | `JWT_SECRET` | A strong random string | For JWT token signing |
   | `CORS_ORIGIN` | Your frontend URL (e.g., `https://yourapp.com`) or `*` | CORS allowed origin |
   | `NODE_ENV` | `production` | Environment setting |

   **Generate JWT Secret**:
   ```bash
   # Generate a secure random string
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

4. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete
   - Your API will be available at `https://your-project.vercel.app`

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Navigate to API Directory**:
   ```bash
   cd api
   ```

4. **Link Project**:
   ```bash
   vercel link
   ```
   - Follow prompts to select/create a project
   - Choose the root directory as `api`

5. **Set Environment Variables**:
   ```bash
   vercel env add DATABASE_URL
   # Enter: postgresql://neondb_owner:npg_Dq3XziHrt4xM@ep-broad-queen-ahyn14aw-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
   
   vercel env add JWT_SECRET
   # Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   
   vercel env add CORS_ORIGIN
   # Enter your frontend URL or "*"
   
   vercel env add NODE_ENV
   # Enter: production
   ```
   - Select "Production", "Preview", and "Development" for each

6. **Deploy**:
   ```bash
   vercel --prod
   ```

## Step 3: Update Frontend API URL

After deployment, update your frontend to use the new Vercel API URL:

1. **Update `src/services/api.ts`**:
   ```typescript
   export const API_URL: string =
     ((Constants.expoConfig?.extra as any)?.API_URL as string) ||
     'https://your-project.vercel.app'; // Update this
   ```

2. **Or set via Environment Variable**:
   - In your Expo config, set the API_URL environment variable
   - For production builds, configure in `app.config.js`:
     ```javascript
     export default ({ config }) => ({
       ...config,
       extra: {
         API_URL: process.env.API_URL || 'https://your-project.vercel.app',
       },
     });
     ```

## Step 4: Verify Deployment

1. **Health Check**:
   ```bash
   curl https://your-project.vercel.app/health
   ```
   Should return: `{"status":"ok","timestamp":"..."}`

2. **Test Authentication**:
   ```bash
   curl -X POST https://your-project.vercel.app/auth/signup \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"test123","name":"Test User"}'
   ```

3. **Check Logs**:
   - Go to Vercel Dashboard → Your Project → Deployments
   - Click on a deployment → View Function Logs
   - Monitor for any errors

## Step 5: Database Migrations on Vercel

For future migrations, you have two options:

### Option A: Run Locally (Recommended)
```bash
cd api
export DATABASE_URL="your-neon-connection-string"
npm run db:deploy
```

### Option B: Use Vercel CLI
```bash
cd api
vercel env pull .env.local  # Pull environment variables
npm run db:deploy
```

## Troubleshooting

### Issue: "Cannot find module" errors
**Solution**: Ensure `vercel-build` script runs Prisma generate:
```json
"vercel-build": "prisma generate && nest build"
```

### Issue: Database connection timeouts
**Solution**: 
- Use Neon's **pooled connection string** (not direct connection)
- Ensure connection string includes `?sslmode=require`
- Check that `pgbouncer=true` is in connection string for serverless

### Issue: CORS errors
**Solution**: 
- Set `CORS_ORIGIN` environment variable in Vercel
- Update `vercel.json` if needed
- Ensure frontend URL matches exactly

### Issue: Cold start delays
**Solution**:
- Vercel serverless functions have cold starts
- Consider using Vercel Pro for better performance
- Implement connection pooling (already configured in Prisma service)

### Issue: Prisma Client not found
**Solution**:
- Ensure `postinstall` script includes `npx prisma generate`
- Check that `vercel-build` runs Prisma generate before build

## Performance Optimization

1. **Connection Pooling**: Already configured in `prisma.service.ts` for Neon
2. **Caching**: The serverless handler caches the Express app instance
3. **Cold Starts**: First request may be slower (~1-2s), subsequent requests are fast

## Monitoring

1. **Vercel Analytics**: Enable in project settings
2. **Function Logs**: View in Vercel dashboard
3. **Neon Dashboard**: Monitor database connections and queries

## Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | Yes | Shared Neon PostgreSQL connection string | `postgresql://neondb_owner:npg_Dq3XziHrt4xM@ep-broad-queen-ahyn14aw-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require` |
| `JWT_SECRET` | Yes | Secret for JWT token signing | `your-secret-key-here` |
| `CORS_ORIGIN` | No | Allowed CORS origin | `https://yourapp.com` or `*` |
| `NODE_ENV` | No | Environment mode | `production` |
| `PORT` | No | Port (not used on Vercel) | - |

## Next Steps

1. ✅ Set up monitoring and alerts
2. ✅ Configure custom domain (optional)
3. ✅ Set up CI/CD for automatic deployments
4. ✅ Enable Vercel Analytics
5. ✅ Set up database backups in Neon

## Support

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Neon Docs**: [neon.tech/docs](https://neon.tech/docs)
- **NestJS on Vercel**: [docs.nestjs.com](https://docs.nestjs.com)

---

**Last Updated**: 2025-01-27

