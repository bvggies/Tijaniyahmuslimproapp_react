# Step-by-Step: Deploy Backend to Vercel

This guide will walk you through deploying the backend to Vercel and configuring the app to use it for both production and local testing.

## Prerequisites

- ✅ Git repository (GitHub, GitLab, or Bitbucket)
- ✅ Vercel account (free at [vercel.com](https://vercel.com))
- ✅ Node.js installed locally
- ✅ Backend code ready in `api/` folder

## Step 1: Prepare Your Code

### 1.1 Verify Backend Structure

Ensure your `api/` folder has:
- ✅ `package.json`
- ✅ `prisma/schema.prisma`
- ✅ `src/` folder with NestJS code
- ✅ `index.ts` (Vercel serverless handler)
- ✅ `vercel.json` (Vercel configuration)

### 1.2 Verify Permanent Database in .env

Check that `api/.env` has the permanent database:
```bash
DATABASE_URL="postgresql://neondb_owner:npg_Dq3XziHrt4xM@ep-broad-queen-ahyn14aw-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

### 1.3 Commit and Push to Git

```bash
# Ensure all changes are committed
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

## Step 2: Create Vercel Account

### 2.1 Sign Up

1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up"
3. Choose "Continue with GitHub" (or GitLab/Bitbucket)
4. Authorize Vercel to access your repositories

### 2.2 Verify Account

- Check your email for verification
- Complete account setup if needed

## Step 3: Deploy Backend to Vercel

### 3.1 Import Project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select your repository containing this project
4. Click "Import"

### 3.2 Configure Project Settings

**Important Settings:**

1. **Project Name**: Choose a name (e.g., `tijaniyah-api`)

2. **Root Directory**: 
   - Click "Edit" next to Root Directory
   - Set to: `api`
   - This tells Vercel the backend is in the `api/` folder

3. **Framework Preset**: 
   - Select "Other" or leave as "Other"

4. **Build Command**: 
   - Set to: `npm run vercel-build`
   - Or: `prisma generate && nest build`

5. **Output Directory**: 
   - **IMPORTANT:** Leave this EMPTY or set to blank
   - Do NOT set to "dist" or "public"
   - Serverless functions don't need an output directory
   - Vercel will use `index.ts` directly

6. **Install Command**: 
   - Set to: `npm install`

7. **Development Command**: 
   - Leave as default or: `npm run start:dev`

### 3.3 Set Environment Variables

**Before deploying, add these environment variables:**

Click "Environment Variables" and add:

1. **DATABASE_URL**
   - Key: `DATABASE_URL`
   - Value: `postgresql://neondb_owner:npg_Dq3XziHrt4xM@ep-broad-queen-ahyn14aw-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require`
   - Select: ✅ Production, ✅ Preview, ✅ Development

2. **JWT_SECRET**
   - Key: `JWT_SECRET`
   - Value: Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   - Select: ✅ Production, ✅ Preview, ✅ Development

3. **CORS_ORIGIN**
   - Key: `CORS_ORIGIN`
   - Value: `*` (or your frontend URL)
   - Select: ✅ Production, ✅ Preview, ✅ Development

4. **NODE_ENV**
   - Key: `NODE_ENV`
   - Value: `production`
   - Select: ✅ Production only

### 3.4 Deploy

1. Click "Deploy" button
2. Wait for build to complete (2-5 minutes)
3. Note your deployment URL (e.g., `https://your-project.vercel.app`)

### 3.5 Verify Deployment

1. Click on your deployment
2. Check the deployment logs for any errors
3. Test the health endpoint:
   ```bash
   curl https://your-project.vercel.app/health
   ```
   Should return: `{"status":"ok","timestamp":"..."}`

## Step 4: Run Database Migrations

### 4.1 Pull Environment Variables Locally

```bash
cd api

# Install Vercel CLI if not installed
npm i -g vercel

# Login to Vercel
vercel login

# Link to your project
vercel link

# Pull environment variables
vercel env pull .env.local
```

### 4.2 Run Migrations

```bash
# Ensure DATABASE_URL is set
npm run db:deploy
```

This applies all migrations to the permanent database.

## Step 5: Configure Frontend to Use Vercel Backend

### 5.1 Update app.config.js

```javascript
export default ({ config }) => ({
  ...config,
  extra: {
    // Use Vercel backend URL for all environments
    API_URL: process.env.API_URL || 'https://your-project.vercel.app',
    // Replace 'your-project' with your actual Vercel project name
  },
});
```

### 5.2 Update src/services/api.ts (Optional)

The file should already use `Constants.expoConfig?.extra?.API_URL`, so it will automatically use the value from `app.config.js`.

### 5.3 Test Locally

```bash
# Start Expo
npm start

# Test in Expo Go or simulator
# All API calls will go to Vercel backend
# Backend connects to permanent database
```

## Step 6: Test the Setup

### 6.1 Test Health Endpoint

```bash
curl https://your-project.vercel.app/health
```

Expected response:
```json
{"status":"ok","timestamp":"2025-01-27T..."}
```

### 6.2 Test Authentication

```bash
# Test signup
curl -X POST https://your-project.vercel.app/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'

# Test login
curl -X POST https://your-project.vercel.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@tijaniyah.com","password":"demo123"}'
```

### 6.3 Test in Expo Go

1. Start Expo: `npm start`
2. Scan QR code with Expo Go
3. Try logging in with: `demo@tijaniyah.com` / `demo123`
4. Verify data loads from permanent database

## Step 7: Production Configuration

### 7.1 Update Frontend for Production Builds

For production builds (EAS Build), ensure `app.config.js` uses the Vercel URL:

```javascript
export default ({ config }) => ({
  ...config,
  extra: {
    API_URL: 'https://your-project.vercel.app',
  },
});
```

### 7.2 Build Production App

```bash
# Build with EAS
eas build --platform android
# or
eas build --platform ios
```

The production app will use the Vercel backend.

## Step 8: Custom Domain (Optional)

### 8.1 Add Custom Domain in Vercel

1. Go to your project settings
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

### 8.2 Update Frontend

Update `app.config.js` with custom domain:
```javascript
API_URL: 'https://api.yourdomain.com'
```

## Troubleshooting

### Build Fails

**Problem:** Vercel build fails

**Solutions:**
1. Check build logs in Vercel dashboard
2. Verify `vercel-build` script exists in `package.json`
3. Ensure Prisma generates: `"vercel-build": "prisma generate && nest build"`
4. Check that all dependencies are in `package.json`

### Database Connection Errors

**Problem:** Backend can't connect to database

**Solutions:**
1. Verify `DATABASE_URL` environment variable in Vercel
2. Check that connection string is correct
3. Ensure database is accessible (check Neon dashboard)
4. Verify SSL is required: `?sslmode=require`

### CORS Errors

**Problem:** Frontend gets CORS errors

**Solutions:**
1. Set `CORS_ORIGIN=*` in Vercel environment variables
2. Or set specific origin: `CORS_ORIGIN=https://your-frontend-domain.com`
3. Restart deployment after changing CORS

### API Not Responding

**Problem:** API returns 404 or errors

**Solutions:**
1. Check function logs in Vercel dashboard
2. Verify `index.ts` exists in `api/` folder
3. Check `vercel.json` configuration
4. Ensure routes are configured correctly

### Frontend Can't Connect

**Problem:** Expo Go can't reach Vercel backend

**Solutions:**
1. Verify `API_URL` in `app.config.js` is correct
2. Check Vercel URL is accessible: `curl https://your-project.vercel.app/health`
3. Ensure CORS is configured: `CORS_ORIGIN=*`
4. Check network connectivity

## Summary

✅ **Backend Deployed**: `https://your-project.vercel.app`  
✅ **Database**: Permanent database (ep-broad-queen-ahyn14aw-pooler)  
✅ **Frontend**: Configured to use Vercel backend  
✅ **Local Testing**: Uses Vercel backend  
✅ **Production**: Uses Vercel backend  

## Architecture

```
Expo Go / Production App
    ↓
Frontend (React Native)
    ↓
Vercel Backend (https://your-project.vercel.app)
    ↓
PERMANENT DATABASE (Neon)
```

## Next Steps

- ✅ Test all API endpoints
- ✅ Verify data persistence
- ✅ Set up monitoring (optional)
- ✅ Configure custom domain (optional)
- ✅ Set up CI/CD for auto-deployment

---

**Your backend is now live on Vercel and ready to use!**

**Last Updated**: 2025-01-27

