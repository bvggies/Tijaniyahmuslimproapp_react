# Quick Reference Card

## 🚀 Deploy to Vercel (5 Steps)

1. **Go to vercel.com/new** → Import your Git repo
2. **Set Root Directory:** `api`
3. **Set Build Command:** `npm run vercel-build`
4. **Add Environment Variables:**
   - `DATABASE_URL` = `postgresql://neondb_owner:npg_Dq3XziHrt4xM@ep-broad-queen-ahyn14aw-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require`
   - `JWT_SECRET` = (generate random string)
   - `CORS_ORIGIN` = `*`
5. **Click Deploy** → Get URL: `https://your-project.vercel.app`

## 📱 Configure Frontend

**Update `app.config.js`:**
```javascript
API_URL: 'https://your-project.vercel.app'
```

**Start Expo:**
```bash
npm start
```

## ✅ Test

```bash
# Health check
curl https://your-project.vercel.app/health

# Login test
curl -X POST https://your-project.vercel.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@tijaniyah.com","password":"demo123"}'
```

## 🗄️ Permanent Database

**Always use this database:**
```
postgresql://neondb_owner:npg_Dq3XziHrt4xM@ep-broad-queen-ahyn14aw-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
```

## 📚 Full Guides

- [Step-by-Step Deployment](./VERCEL_DEPLOYMENT_STEP_BY_STEP.md)
- [Deployment Checklist](./VERCEL_CHECKLIST.md)
- [Frontend Configuration](./FRONTEND_CONFIGURATION.md)

---

**Everything uses the PERMANENT DATABASE!**

