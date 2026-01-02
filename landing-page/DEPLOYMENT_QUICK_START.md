# Quick Start: Deploy to Vercel

## 🚀 Fastest Way to Deploy

### Step 1: Push to Git
```bash
git add landing-page
git commit -m "Add landing page"
git push origin main
```

### Step 2: Deploy on Vercel

1. **Go to Vercel:**
   - Visit [vercel.com/new](https://vercel.com/new)
   - Sign in with GitHub/GitLab/Bitbucket

2. **Import Project:**
   - Click "Import Git Repository"
   - Select your repository
   - Click "Import"

3. **Configure:**
   - **Root Directory**: Click "Edit" → Set to `landing-page`
   - **Framework**: Auto-detected as "Create React App" ✅
   - **Build Command**: `npm run build` (auto-filled) ✅
   - **Output Directory**: `build` (auto-filled) ✅

4. **Deploy:**
   - Click "Deploy"
   - Wait ~2 minutes
   - Your site is live! 🎉

## ✅ That's It!

Your landing page will be available at:
- **Production URL**: `https://your-project.vercel.app`
- **Custom Domain**: Add in Vercel Settings → Domains

## 🔄 Automatic Updates

Every time you push to `main`:
- Vercel automatically builds and deploys
- Zero configuration needed
- Preview deployments for other branches

## 📝 Need More Details?

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for:
- CLI deployment
- Custom domains
- Environment variables
- Troubleshooting

