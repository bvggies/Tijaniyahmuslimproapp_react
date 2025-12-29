# Vercel Deployment Checklist

Use this checklist to ensure everything is set up correctly.

## Pre-Deployment Checklist

- [ ] Code is committed and pushed to Git
- [ ] `api/.env` has permanent database connection string
- [ ] `api/index.ts` exists (Vercel serverless handler)
- [ ] `api/vercel.json` exists and is configured
- [ ] `api/package.json` has `vercel-build` script
- [ ] Database migrations are ready
- [ ] Test users are seeded in database

## Vercel Account Setup

- [ ] Vercel account created
- [ ] GitHub/GitLab/Bitbucket connected
- [ ] Repository access granted

## Vercel Project Configuration

- [ ] Project imported from Git repository
- [ ] Root Directory set to `api`
- [ ] Build Command: `npm run vercel-build`
- [ ] Install Command: `npm install`
- [ ] Framework Preset: "Other"

## Environment Variables

- [ ] `DATABASE_URL` - Permanent database connection string
- [ ] `JWT_SECRET` - Generated secure random string
- [ ] `CORS_ORIGIN` - Set to `*` or your frontend URL
- [ ] `NODE_ENV` - Set to `production` (production only)
- [ ] All variables enabled for Production, Preview, Development

## Deployment

- [ ] Deployment started
- [ ] Build completed successfully
- [ ] No errors in build logs
- [ ] Deployment URL noted: `https://your-project.vercel.app`

## Post-Deployment Verification

- [ ] Health endpoint works: `curl https://your-project.vercel.app/health`
- [ ] Signup endpoint works
- [ ] Login endpoint works
- [ ] Database migrations applied
- [ ] Test users accessible

## Frontend Configuration

- [ ] `app.config.js` updated with Vercel URL
- [ ] `src/services/api.ts` uses API_URL from config
- [ ] Tested in Expo Go
- [ ] Tested in simulator/emulator
- [ ] Production build tested (if applicable)

## Testing

- [ ] Local testing with Vercel backend works
- [ ] Expo Go connects to Vercel backend
- [ ] Authentication works
- [ ] Data loads from permanent database
- [ ] All API endpoints functional

## Production Ready

- [ ] Custom domain configured (optional)
- [ ] Monitoring set up (optional)
- [ ] Error tracking configured (optional)
- [ ] Documentation updated

---

**Quick Test Commands:**

```bash
# Health check
curl https://your-project.vercel.app/health

# Test login
curl -X POST https://your-project.vercel.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@tijaniyah.com","password":"demo123"}'
```

---

**Need help?** See [VERCEL_DEPLOYMENT_STEP_BY_STEP.md](./VERCEL_DEPLOYMENT_STEP_BY_STEP.md)

