# Local Development Setup

## ⚠️ PERMANENT DATABASE

**All local development, Expo Go, and testing MUST use the permanent database.**

The backend API (whether running locally or deployed) **ALWAYS** connects to the permanent database:
```
postgresql://neondb_owner:npg_Dq3XziHrt4xM@ep-broad-queen-ahyn14aw-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
```

See [PERMANENT_DATABASE.md](./PERMANENT_DATABASE.md) for complete details.

## Setup for Local Development

### Backend API Setup

1. **Navigate to API directory:**
   ```bash
   cd api
   ```

2. **Ensure `.env` file exists with permanent database:**
   ```bash
   DATABASE_URL="postgresql://neondb_owner:npg_Dq3XziHrt4xM@ep-broad-queen-ahyn14aw-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"
   JWT_SECRET=your-jwt-secret-here
   CORS_ORIGIN=*
   PORT=3000
   ```

3. **Start the backend server:**
   ```bash
   npm run start:dev
   ```
   
   The API will be available at `http://localhost:3000`

### Frontend Setup (Expo/React Native)

#### Option 1: Use Local Backend (Recommended for Development)

1. **Start the backend locally** (see above)

2. **Update `app.config.js` or set environment variable:**
   ```bash
   # For local development, point to localhost
   export API_URL=http://localhost:3000
   ```

3. **For Expo Go on physical device:**
   - Use your computer's local IP address instead of `localhost`
   - Find your IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
   - Example: `http://192.168.1.100:3000`
   - Update `app.config.js` or set `API_URL` environment variable

4. **Start Expo:**
   ```bash
   npm start
   ```

#### Option 2: Use Deployed Backend (Vercel)

1. **Deploy backend to Vercel** (see [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md))

2. **Set API_URL in `app.config.js`:**
   ```javascript
   export default ({ config }) => ({
     ...config,
     extra: {
       API_URL: process.env.API_URL || 'https://your-project.vercel.app',
     },
   });
   ```

3. **Start Expo:**
   ```bash
   npm start
   ```

## Environment Variables

### Backend (api/.env)

```bash
# PERMANENT DATABASE - DO NOT CHANGE
DATABASE_URL="postgresql://neondb_owner:npg_Dq3XziHrt4xM@ep-broad-queen-ahyn14aw-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"

# Application
NODE_ENV=development
PORT=3000

# JWT
JWT_SECRET=your-jwt-secret-here

# CORS
CORS_ORIGIN=*
```

### Frontend (app.config.js or .env)

```bash
# For local backend
API_URL=http://localhost:3000

# OR for deployed backend (Vercel)
API_URL=https://your-project.vercel.app
```

## Expo Go Configuration

### Using Local Backend with Expo Go

**Important:** Expo Go on a physical device cannot access `localhost`. You need to use your computer's local IP address.

1. **Find your local IP:**
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   # or
   ip addr show
   ```

2. **Update API URL to use your IP:**
   ```javascript
   // app.config.js
   export default ({ config }) => ({
     ...config,
     extra: {
       API_URL: process.env.API_URL || 'http://YOUR_LOCAL_IP:3000',
       // Example: 'http://192.168.1.100:3000'
     },
   });
   ```

3. **Ensure backend CORS allows your device:**
   - Backend should have `CORS_ORIGIN=*` for development
   - Or set specific origin in `api/.env`

4. **Start backend:**
   ```bash
   cd api
   npm run start:dev
   ```

5. **Start Expo:**
   ```bash
   npm start
   ```

6. **Scan QR code with Expo Go app**

### Using Deployed Backend with Expo Go

1. **Deploy backend to Vercel** (see [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md))

2. **Set API_URL to Vercel URL:**
   ```javascript
   // app.config.js
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

4. **Scan QR code with Expo Go app**

## Testing

### All Testing Uses Permanent Database

Whether you're running:
- ✅ Unit tests
- ✅ Integration tests
- ✅ E2E tests
- ✅ Manual testing in Expo Go
- ✅ Manual testing in simulator/emulator

**All tests connect to the permanent database through the backend API.**

### Test Users

Use the seeded test users:
- `demo@tijaniyah.com` / `demo123`
- `admin@tijaniyahpro.com` / `admin123`
- `user1@example.com` / `user1123`
- etc.

See the seed output for all test credentials.

## Important Notes

1. **Backend Always Uses Permanent Database:**
   - Local backend → Permanent database
   - Deployed backend → Permanent database
   - No local database instances

2. **Frontend Connects to Backend:**
   - Frontend doesn't connect directly to database
   - Frontend connects to backend API
   - Backend API connects to permanent database

3. **Expo Go Limitations:**
   - Cannot use `localhost` - use local IP address
   - Or use deployed backend URL

4. **Network Requirements:**
   - Backend needs internet to connect to Neon database
   - Frontend needs network access to reach backend API

## Troubleshooting

### Expo Go Can't Connect to Backend

**Problem:** Expo Go shows network errors when trying to reach backend.

**Solutions:**
1. Use local IP address instead of `localhost`
2. Ensure backend is running: `cd api && npm run start:dev`
3. Check firewall settings
4. Use deployed backend instead (Vercel)

### Backend Can't Connect to Database

**Problem:** Backend shows database connection errors.

**Solutions:**
1. Verify `.env` file has correct `DATABASE_URL`
2. Check internet connection (Neon is cloud database)
3. Verify database credentials are correct
4. Check Neon dashboard for database status

### CORS Errors

**Problem:** Frontend gets CORS errors from backend.

**Solutions:**
1. Set `CORS_ORIGIN=*` in `api/.env` for development
2. Or add specific origin in backend CORS configuration
3. Restart backend after changing CORS settings

## Quick Start Commands

```bash
# Terminal 1: Start Backend
cd api
npm run start:dev

# Terminal 2: Start Frontend
npm start

# Then scan QR code with Expo Go
```

---

**Remember:** All environments (local, testing, production) use the **PERMANENT DATABASE**.

**Last Updated:** 2025-01-27

