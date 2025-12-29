# Quick Start Guide

## ⚠️ PERMANENT DATABASE

**All environments (Expo Go, local testing, production) use the PERMANENT database:**
```
postgresql://neondb_owner:npg_Dq3XziHrt4xM@ep-broad-queen-ahyn14aw-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
```

See [PERMANENT_DATABASE.md](./PERMANENT_DATABASE.md) for complete details.

## Quick Start (5 Minutes)

### Option 1: Use Vercel Backend (Recommended)

**Best for:** Production and local testing with same backend

1. **Deploy Backend to Vercel:**
   - See [VERCEL_DEPLOYMENT_STEP_BY_STEP.md](./VERCEL_DEPLOYMENT_STEP_BY_STEP.md)
   - Get your Vercel URL: `https://your-project.vercel.app`

2. **Configure Frontend:**
   ```bash
   # Update app.config.js with Vercel URL
   # API_URL: 'https://your-project.vercel.app'
   
   npm install
   npm start
   ```

3. **Test:**
   - Scan QR code with Expo Go
   - App connects to Vercel backend
   - Backend connects to permanent database
   - Ready to test!

### Option 2: Use Local Backend

**For Expo Go on Physical Device:**

```bash
# Terminal 1: Start Backend
cd api
npm install
npm run db:setup
npm run start:dev  # Runs on http://localhost:3000

# Terminal 2: Start Frontend
# Find your local IP: ipconfig (Windows) or ifconfig (Mac/Linux)
# Update app.config.js: API_URL: 'http://YOUR_IP:3000'
npm install
npm start
```

**For Simulator/Emulator:**

```bash
# Terminal 1: Start Backend
cd api
npm install
npm run db:setup
npm run start:dev

# Terminal 2: Start Frontend
# app.config.js: API_URL: 'http://localhost:3000'
npm install
npm start
```

## Test Users

All users are in the permanent database:
- `demo@tijaniyah.com` / `demo123`
- `admin@tijaniyahpro.com` / `admin123`
- `user1@example.com` / `user1123`

## Architecture

```
Expo Go / Simulator
    ↓
Frontend (React Native)
    ↓
Backend API (localhost:3000 or Vercel)
    ↓
PERMANENT DATABASE (Neon)
```

**Key Points:**
- ✅ Frontend never connects directly to database
- ✅ Backend always uses permanent database
- ✅ All environments use same database
- ✅ No local databases

## Troubleshooting

**Expo Go can't connect?**
- Use local IP address, not `localhost`
- Ensure backend is running
- Check firewall settings

**Backend errors?**
- Verify `.env` has permanent database URL
- Check internet connection (Neon is cloud)
- See backend logs

## Next Steps

- [Local Development Guide](./LOCAL_DEVELOPMENT.md)
- [Expo Go Setup](./EXPO_GO_SETUP.md)
- [Vercel Deployment](./VERCEL_DEPLOYMENT.md)

---

**Remember:** Everything uses the **PERMANENT DATABASE**!

