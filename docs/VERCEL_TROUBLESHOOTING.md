# Vercel Deployment Troubleshooting

## Common Errors and Solutions

### Error: "No Output Directory named 'public' found"

**Problem:** Vercel is looking for a `public` directory after build, but NestJS builds to `dist` and serverless functions don't need an output directory.

**Solution:**

1. **In Vercel Dashboard:**
   - Go to Project Settings → General
   - Find "Output Directory" field
   - **Leave it EMPTY** (do not set to "dist" or "public")
   - Click "Save"

2. **Verify vercel.json:**
   - Ensure `vercel.json` uses the `builds` format (not `outputDirectory`)
   - The `index.ts` file is the serverless function entry point

3. **Alternative:** If you must set an output directory:
   - Set to: `.` (current directory)
   - But this is not recommended for serverless functions

### Error: Build fails with TypeScript errors

**Problem:** TypeScript compilation errors during build.

**Solution:**
1. Test build locally: `cd api && npm run vercel-build`
2. Fix any TypeScript errors
3. Ensure `tsconfig.json` is properly configured
4. Check that all imports are correct

### Error: Prisma Client not found

**Problem:** `@prisma/client` module not found.

**Solution:**
1. Ensure `vercel-build` script includes Prisma generate:
   ```json
   "vercel-build": "prisma generate && nest build"
   ```
2. Verify `postinstall` script: `"postinstall": "npx prisma generate"`
3. Check that `prisma` is in `package.json` dependencies

### Error: Database connection timeout

**Problem:** Backend can't connect to database.

**Solution:**
1. Verify `DATABASE_URL` environment variable in Vercel
2. Ensure connection string uses pooled connection (`-pooler` in hostname)
3. Check that `sslmode=require` is in connection string
4. Verify database is accessible (check Neon dashboard)

### Error: CORS errors from frontend

**Problem:** Frontend gets CORS errors when calling API.

**Solution:**
1. Set `CORS_ORIGIN=*` in Vercel environment variables
2. Or set specific origin: `CORS_ORIGIN=https://your-frontend-domain.com`
3. Restart deployment after changing CORS settings

### Error: Function timeout

**Problem:** API requests timeout after 10 seconds.

**Solution:**
1. Check `vercel.json` has `maxDuration: 30` in functions config
2. For longer operations, consider optimizing queries
3. Vercel Pro allows up to 60 seconds

### Error: Module not found

**Problem:** Cannot find module errors.

**Solution:**
1. Ensure all dependencies are in `package.json` (not just devDependencies)
2. Check that `node_modules` is not in `.vercelignore`
3. Verify imports use correct paths

## Vercel Project Settings Checklist

When setting up in Vercel dashboard:

- ✅ **Root Directory:** `api`
- ✅ **Framework Preset:** `Other`
- ✅ **Build Command:** `npm run vercel-build`
- ✅ **Output Directory:** **EMPTY** (leave blank)
- ✅ **Install Command:** `npm install`
- ✅ **Development Command:** (optional)

## Verification Steps

After deployment:

1. **Check Build Logs:**
   - Go to Deployment → View Build Logs
   - Look for errors or warnings

2. **Test Health Endpoint:**
   ```bash
   curl https://your-project.vercel.app/health
   ```

3. **Check Function Logs:**
   - Go to Deployment → View Function Logs
   - Monitor for runtime errors

4. **Test API Endpoints:**
   ```bash
   # Test signup
   curl -X POST https://your-project.vercel.app/auth/signup \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"test123","name":"Test"}'
   ```

## Still Having Issues?

1. **Check Vercel Status:** [status.vercel.com](https://status.vercel.com)
2. **Review Documentation:** [vercel.com/docs](https://vercel.com/docs)
3. **Check Build Logs:** Detailed error messages in Vercel dashboard
4. **Test Locally:** Ensure it works locally first

---

**Common Fix:** Most issues are resolved by ensuring Output Directory is **EMPTY** in Vercel project settings.

