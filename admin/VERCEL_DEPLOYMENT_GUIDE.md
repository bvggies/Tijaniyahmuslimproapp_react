# Step-by-Step Guide: Deploy Admin Dashboard to Vercel

## Prerequisites
- ✅ GitHub account with the repository pushed
- ✅ Vercel account (sign up at [vercel.com](https://vercel.com) if needed)
- ✅ Backend API deployed on Vercel (should be at `https://tijaniyahmuslimproapp-backend.vercel.app`)

---

## Method 1: Deploy via Vercel Dashboard (Recommended)

### Step 1: Push Admin Folder to GitHub
If you haven't already, ensure the admin folder is committed and pushed:

```bash
cd C:\Users\kyeib\Desktop\Tijaniyahmuslimproapp
git add admin/
git commit -m "feat: Add admin dashboard for Vercel deployment"
git push origin main
```

### Step 2: Import Project to Vercel

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Sign in (or create an account)
   - Click **"Add New..."** → **"Project"**

2. **Connect GitHub Repository**
   - Click **"Import Git Repository"**
   - Select your `Tijaniyahmuslimproapp` repository
   - Click **"Import"**

3. **Configure Project Settings**
   
   **Project Name:** `tijaniyah-admin-dashboard` (or your preferred name)
   
   **Framework Preset:** `Create React App`
   
   **Root Directory:** ⚠️ **IMPORTANT** - Click **"Edit"** and set to:
   ```
   admin
   ```
   
   **Build Command:** (should auto-detect)
   ```
   npm run build
   ```
   
   **Output Directory:** (should auto-detect)
   ```
   build
   ```

4. **Environment Variables**
   
   Click **"Environment Variables"** and add:
   
   | Name | Value |
   |------|-------|
   | `REACT_APP_API_BASE_URL` | `https://tijaniyahmuslimproapp-backend.vercel.app` |
   
   ⚠️ **Important:** Make sure to add this to **Production**, **Preview**, and **Development** environments.

5. **Deploy**
   - Click **"Deploy"**
   - Wait for the build to complete (usually 2-3 minutes)
   - Your admin dashboard will be live at: `https://tijaniyah-admin-dashboard.vercel.app` (or your custom domain)

---

## Method 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate.

### Step 3: Navigate to Admin Folder

```bash
cd C:\Users\kyeib\Desktop\Tijaniyahmuslimproapp\admin
```

### Step 4: Deploy

```bash
vercel
```

**First-time deployment prompts:**
- **Set up and deploy?** → `Y`
- **Which scope?** → Select your account
- **Link to existing project?** → `N` (first time) or `Y` (if redeploying)
- **Project name?** → `tijaniyah-admin-dashboard` (or your choice)
- **Directory?** → `.` (current directory)
- **Override settings?** → `N` (it will use `vercel.json`)

### Step 5: Set Environment Variables

```bash
vercel env add REACT_APP_API_BASE_URL
```

When prompted:
- **Value:** `https://tijaniyahmuslimproapp-backend.vercel.app`
- **Environment:** Select `Production`, `Preview`, and `Development`

### Step 6: Deploy to Production

```bash
vercel --prod
```

---

## Post-Deployment Steps

### 1. Verify Deployment

1. Visit your Vercel deployment URL
2. Try logging in with admin credentials:
   - Email: `admin@tijaniyahpro.com`
   - Password: `admin123`
3. Check that the dashboard loads and connects to the API

### 2. Set Custom Domain (Optional)

1. Go to your project in Vercel Dashboard
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain (e.g., `admin.tijaniyahpro.com`)
4. Follow DNS configuration instructions

### 3. Configure Automatic Deployments

Vercel automatically deploys when you push to:
- **Production:** `main` branch
- **Preview:** All other branches and pull requests

No additional configuration needed! 🎉

---

## Troubleshooting

### Issue: Build Fails

**Error:** `Module not found` or missing dependencies

**Solution:**
```bash
cd admin
rm -rf node_modules package-lock.json
npm install
git add package-lock.json
git commit -m "fix: Update admin dependencies"
git push
```

### Issue: API Connection Fails

**Error:** Dashboard shows "Using demo data"

**Solution:**
1. Check environment variable is set correctly in Vercel
2. Verify backend API is accessible: `https://tijaniyahmuslimproapp-backend.vercel.app`
3. Check browser console for CORS errors
4. Redeploy after fixing environment variables

### Issue: 404 on Page Refresh

**Error:** Page not found when refreshing routes

**Solution:** Already handled by `vercel.json` rewrites. If issue persists, verify `vercel.json` is in the `admin` folder.

### Issue: Admin Folder Not Found on GitHub

**Solution:**
```bash
cd C:\Users\kyeib\Desktop\Tijaniyahmuslimproapp
git add admin/
git commit -m "feat: Add admin dashboard"
git push origin main
```

Wait a few minutes, then refresh GitHub.

---

## Environment Variables Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `REACT_APP_API_BASE_URL` | Backend API URL | Yes | `https://tijaniyahmuslimproapp-backend.vercel.app` |

---

## Project Structure on Vercel

```
Repository Root
└── admin/              ← Root Directory in Vercel
    ├── src/
    ├── public/
    ├── package.json
    ├── vercel.json     ← Vercel configuration
    └── build/          ← Output directory
```

---

## Quick Commands Reference

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View deployment logs
vercel logs

# List all deployments
vercel ls

# Remove deployment
vercel remove
```

---

## Next Steps

After successful deployment:

1. ✅ Test all admin dashboard features
2. ✅ Verify API connectivity
3. ✅ Test authentication flow
4. ✅ Set up custom domain (optional)
5. ✅ Configure monitoring/alerts (optional)

---

**Need Help?** Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)

