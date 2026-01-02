# Vercel Deployment Guide - Landing Page

This guide will help you deploy the Tijaniyah Muslim Pro landing page to Vercel.

## Prerequisites

- ✅ Git repository (GitHub, GitLab, or Bitbucket)
- ✅ Vercel account (free at [vercel.com](https://vercel.com))
- ✅ Node.js installed locally (for testing)

## Quick Deploy (Recommended)

### Option 1: Deploy via Vercel Dashboard

1. **Push your code to Git:**
   ```bash
   git add landing-page
   git commit -m "Add landing page"
   git push origin main
   ```

2. **Import Project to Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Git Repository"
   - Select your repository
   - Click "Import"

3. **Configure Project Settings:**
   - **Root Directory**: Click "Edit" and set to `landing-page`
   - **Framework Preset**: Select "Create React App" (Vercel will auto-detect)
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `build` (auto-filled)
   - **Install Command**: `npm install` (auto-filled)

4. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete
   - Your site will be live at `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Navigate to landing-page directory:**
   ```bash
   cd landing-page
   ```

4. **Deploy:**
   ```bash
   vercel
   ```
   - Follow the prompts
   - Select "Set up and deploy" for new project
   - Confirm settings (they should auto-detect correctly)

5. **For production deployment:**
   ```bash
   vercel --prod
   ```

## Project Configuration

The `vercel.json` file is already configured with:
- ✅ SPA routing (all routes redirect to index.html)
- ✅ Static asset caching
- ✅ Security headers
- ✅ Build output directory

## Environment Variables

This landing page doesn't require any environment variables. If you need to add any in the future:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add your variables
3. Redeploy

## Custom Domain Setup

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Vercel will automatically provision SSL certificates

## Continuous Deployment

Vercel automatically deploys:
- **Production**: Every push to `main` branch
- **Preview**: Every push to other branches or pull requests

## Build Settings

The project uses these default settings (configured in `vercel.json`):
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

## Troubleshooting

### Build Fails

1. **Check build logs** in Vercel Dashboard
2. **Test build locally:**
   ```bash
   cd landing-page
   npm install
   npm run build
   ```
3. **Verify Node.js version** - Vercel uses Node.js 18.x by default

### Routing Issues (404 on refresh)

The `vercel.json` file includes rewrites to handle SPA routing. If you still see 404s:
- Verify `vercel.json` is in the `landing-page` directory
- Check that rewrites are configured correctly
- Redeploy the project

### Assets Not Loading

- Check that static files are in the `public` folder
- Verify build output includes all assets
- Check browser console for 404 errors

## Performance Optimization

Vercel automatically:
- ✅ Optimizes images
- ✅ Minifies JavaScript and CSS
- ✅ Enables compression
- ✅ Caches static assets
- ✅ Uses CDN for global distribution

## Monitoring

- View deployment logs in Vercel Dashboard
- Check Analytics for traffic and performance
- Monitor errors in the Vercel dashboard

## Updating the Site

Simply push changes to your Git repository:
```bash
git add .
git commit -m "Update landing page"
git push origin main
```

Vercel will automatically:
1. Detect the push
2. Build the new version
3. Deploy to production

## Preview Deployments

Every branch and pull request gets a preview URL:
- Test changes before merging
- Share preview links with team
- Preview deployments are automatically cleaned up

## Support

- Vercel Documentation: [vercel.com/docs](https://vercel.com/docs)
- Vercel Community: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)

---

**Your landing page is now live! 🚀**

