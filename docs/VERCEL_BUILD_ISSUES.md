# Vercel Build Issues and Solutions

## Build Log Stops at "npm install"

### Problem
Build log shows:
```
Running "vercel build"
Running "install" command: `npm install`...
```
And then stops or fails.

### Solutions

#### 1. Check Build Command in Vercel Dashboard

**CRITICAL:** The `buildCommand` in `vercel.json` might not be used if dashboard settings override it.

**Steps:**
1. Go to Vercel Dashboard → Your Project → Settings → General
2. Scroll to "Build & Development Settings"
3. **Build Command** should be: `npm run vercel-build`
4. If it's different or empty, set it to: `npm run vercel-build`
5. Click "Save"
6. Redeploy

#### 2. Verify Root Directory

1. In same settings page
2. **Root Directory** should be: `api`
3. If it's `.` or empty, change it to: `api`
4. Click "Save"
5. Redeploy

#### 3. Check Complete Build Logs

The build log you shared stops at `npm install`. Check for:

**After npm install, you should see:**
```
✓ Installed dependencies
Running "build" command: `npm run vercel-build`
> prisma generate
✓ Prisma Client generated
> nest build
✓ Build successful
```

**If you see errors:**
- Share the complete error message
- Common issues:
  - Missing dependencies
  - TypeScript errors
  - Prisma generation failures
  - Environment variables missing

#### 4. Verify Package.json Scripts

Ensure `api/package.json` has:
```json
{
  "scripts": {
    "vercel-build": "prisma generate && nest build"
  }
}
```

#### 5. Check Environment Variables

Build might fail if required env vars are missing:

**Required in Vercel Dashboard:**
- `DATABASE_URL` - Your Neon database connection string
- `JWT_SECRET` - Generated secret (32+ characters)
- `CORS_ORIGIN` - `*` or your frontend URL

**To set:**
1. Vercel Dashboard → Settings → Environment Variables
2. Add each variable
3. Select: Production, Preview, Development
4. Save and redeploy

#### 6. Test Build Locally

Before deploying, test the build locally:

```bash
cd api
npm install
npm run vercel-build
```

If this fails locally, fix the errors before deploying.

#### 7. Check Node Version

Vercel might be using wrong Node version:

1. Vercel Dashboard → Settings → General
2. Find "Node.js Version"
3. Set to: `20.x` (or latest LTS)
4. Save and redeploy

Or add to `package.json`:
```json
{
  "engines": {
    "node": ">=20.0.0"
  }
}
```

## Common Build Errors

### Error: "Cannot find module '@prisma/client'"

**Solution:**
- Ensure `vercel-build` includes `prisma generate`
- Check that `prisma` is in `dependencies` (not just `devDependencies`)

### Error: "TypeScript compilation failed"

**Solution:**
- Check `tsconfig.json` is correct
- Run `npm run build` locally to see errors
- Fix TypeScript errors before deploying

### Error: "Build command not found"

**Solution:**
- Verify `vercel-build` script exists in `package.json`
- Set Build Command in dashboard to: `npm run vercel-build`

### Error: "Function not detected"

**Solution:**
- Verify `api/api/index.ts` exists
- Check `vercel.json` has correct function path: `api/index.ts`
- Ensure Root Directory is set to `api` in dashboard

## Complete Build Log Checklist

A successful build should show:

```
✓ Cloning repository
✓ Found .vercelignore
✓ Running "install" command: `npm install`
✓ Installed dependencies (X packages)
✓ Running "build" command: `npm run vercel-build`
  > prisma generate
  ✓ Prisma Client generated
  > nest build
  ✓ Build successful
✓ Function detected: api/index.ts
✓ Deployment ready
```

## Next Steps

1. **Get Complete Build Log:**
   - Wait for build to complete or fail
   - Copy the ENTIRE log (not just the beginning)
   - Share any error messages

2. **Verify Dashboard Settings:**
   - Root Directory = `api`
   - Build Command = `npm run vercel-build`
   - Output Directory = EMPTY
   - Node Version = 20.x

3. **Test Locally:**
   ```bash
   cd api
   npm install
   npm run vercel-build
   ```

4. **Check Environment Variables:**
   - All required vars are set in Vercel dashboard
   - Values are correct (no typos)

---

**If build still fails, share the complete build log with error messages.**

