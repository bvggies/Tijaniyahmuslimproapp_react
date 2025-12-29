# Expo Go Setup with Permanent Database

## ⚠️ IMPORTANT: Permanent Database

**Expo Go and all local testing MUST use the permanent database through the backend API.**

The backend API (whether local or deployed) **ALWAYS** connects to:
```
postgresql://neondb_owner:npg_Dq3XziHrt4xM@ep-broad-queen-ahyn14aw-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
```

## Quick Setup for Expo Go

### Step 1: Start Backend (Uses Permanent Database)

```bash
cd api

# Ensure .env has permanent database
# DATABASE_URL="postgresql://neondb_owner:npg_Dq3XziHrt4xM@ep-broad-queen-ahyn14aw-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"

npm run start:dev
```

Backend will run at `http://localhost:3000` and connect to permanent database.

### Step 2: Configure Frontend for Expo Go

**For Expo Go on Physical Device:**

Expo Go cannot access `localhost`. You need your computer's local IP address.

1. **Find your local IP:**
   ```bash
   # Windows
   ipconfig
   # Look for IPv4 Address (e.g., 192.168.1.100)
   
   # Mac/Linux
   ifconfig
   # or
   ip addr show
   ```

2. **Update `app.config.js`:**
   ```javascript
   export default ({ config }) => ({
     ...config,
     extra: {
       API_URL: 'http://YOUR_LOCAL_IP:3000',
       // Example: 'http://192.168.1.100:3000'
     },
   });
   ```

3. **Or set environment variable:**
   ```bash
   export API_URL=http://192.168.1.100:3000
   npm start
   ```

**For Expo Go on Simulator/Emulator:**

You can use `localhost`:
```javascript
export default ({ config }) => ({
  ...config,
  extra: {
    API_URL: 'http://localhost:3000',
  },
});
```

### Step 3: Start Expo

```bash
npm start
```

Scan the QR code with Expo Go app.

## Alternative: Use Deployed Backend

If you prefer not to run backend locally:

1. **Deploy backend to Vercel** (see [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md))

2. **Update `app.config.js`:**
   ```javascript
   export default ({ config }) => ({
     ...config,
     extra: {
       API_URL: 'https://your-project.vercel.app',
     },
   });
   ```

3. **Start Expo:**
   ```bash
   npm start
   ```

## Database Connection Flow

```
Expo Go App
    ↓
Frontend (React Native)
    ↓
Backend API (Local or Vercel)
    ↓
PERMANENT DATABASE (Neon)
```

**Important:** 
- Frontend never connects directly to database
- Frontend connects to backend API
- Backend API always uses permanent database

## Test Users

All test users are in the permanent database:
- `demo@tijaniyah.com` / `demo123`
- `admin@tijaniyahpro.com` / `admin123`
- `user1@example.com` / `user1123`
- etc.

## Troubleshooting

### "Network request failed" in Expo Go

**Solution:** Use your local IP address, not `localhost`

### Backend connection errors

**Solution:** 
1. Ensure backend is running: `cd api && npm run start:dev`
2. Check backend logs for database connection
3. Verify `.env` has permanent database URL

### CORS errors

**Solution:**
1. Set `CORS_ORIGIN=*` in `api/.env`
2. Restart backend

## Summary

✅ **Expo Go** → Frontend → Backend → Permanent Database  
✅ **All testing** → Uses permanent database  
✅ **Local development** → Uses permanent database  
✅ **Production** → Uses permanent database  

**No local databases. Everything uses the permanent database.**

---

See [LOCAL_DEVELOPMENT.md](./LOCAL_DEVELOPMENT.md) for complete local development guide.

