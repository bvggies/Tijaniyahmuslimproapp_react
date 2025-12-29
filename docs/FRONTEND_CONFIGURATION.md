# Frontend Configuration for Vercel Backend

This guide shows how to configure the frontend to use the Vercel backend for both production and local testing.

## Quick Configuration

### Step 1: Get Your Vercel URL

After deploying to Vercel, you'll get a URL like:
```
https://your-project.vercel.app
```

### Step 2: Update app.config.js

Open `app.config.js` in the project root and update:

```javascript
export default ({ config }) => ({
  ...config,
  extra: {
    // Replace 'your-project' with your actual Vercel project name
    API_URL: process.env.API_URL || 'https://your-project.vercel.app',
  },
});
```

### Step 3: Test

```bash
npm start
```

The app will now use the Vercel backend for all API calls.

## Configuration Options

### Option 1: Always Use Vercel (Recommended)

**Best for:** Production and local testing with same backend

```javascript
// app.config.js
export default ({ config }) => ({
  ...config,
  extra: {
    API_URL: 'https://your-project.vercel.app',
  },
});
```

**Pros:**
- ✅ Same backend for all environments
- ✅ No local backend needed
- ✅ Easy to test
- ✅ Production-ready

**Cons:**
- ⚠️ Requires internet connection
- ⚠️ Slightly slower than local backend

### Option 2: Use Environment Variable

**Best for:** Different URLs for different environments

```javascript
// app.config.js
export default ({ config }) => ({
  ...config,
  extra: {
    API_URL: process.env.API_URL || 'https://your-project.vercel.app',
  },
});
```

Then set environment variable:
```bash
# For local backend
export API_URL=http://localhost:3000
npm start

# For Vercel backend (default)
npm start
```

### Option 3: Conditional Based on Environment

**Best for:** Automatic switching

```javascript
// app.config.js
export default ({ config }) => ({
  ...config,
  extra: {
    API_URL: __DEV__ 
      ? 'http://localhost:3000'  // Local development
      : 'https://your-project.vercel.app',  // Production
  },
});
```

## For Expo Go on Physical Device

If using local backend with Expo Go on a physical device:

```javascript
// app.config.js
export default ({ config }) => ({
  ...config,
  extra: {
    // Use your computer's local IP address
    API_URL: 'http://192.168.1.100:3000',  // Replace with your IP
  },
});
```

**Find your IP:**
```bash
# Windows
ipconfig

# Mac/Linux
ifconfig
```

## Verification

### Test API Connection

1. Start Expo: `npm start`
2. Open app in Expo Go
3. Try to login with: `demo@tijaniyah.com` / `demo123`
4. Check console logs for API requests

### Check API URL

The app logs will show:
```
🌐 API Request: GET https://your-project.vercel.app/health
```

### Test Endpoints

```bash
# Health check
curl https://your-project.vercel.app/health

# Should return: {"status":"ok","timestamp":"..."}
```

## Architecture

```
Expo Go / Production App
    ↓
Frontend (React Native)
    ↓
Vercel Backend (https://your-project.vercel.app)
    ↓
PERMANENT DATABASE (Neon)
```

## Troubleshooting

### App Can't Connect to Vercel

**Check:**
1. Vercel URL is correct in `app.config.js`
2. Vercel deployment is live (check Vercel dashboard)
3. Internet connection is working
4. CORS is configured: `CORS_ORIGIN=*` in Vercel

### API Returns Errors

**Check:**
1. Backend logs in Vercel dashboard
2. Environment variables are set correctly
3. Database connection is working
4. Health endpoint works: `curl https://your-project.vercel.app/health`

### Still Using Old URL

**Solution:**
1. Clear Expo cache: `expo start -c`
2. Restart Expo
3. Rebuild if needed

## Production Builds

For EAS Build production apps, ensure `app.config.js` has the Vercel URL:

```javascript
export default ({ config }) => ({
  ...config,
  extra: {
    API_URL: 'https://your-project.vercel.app',
  },
});
```

The production app will automatically use the Vercel backend.

## Summary

✅ **Update `app.config.js`** with Vercel URL  
✅ **Test locally** with Expo Go  
✅ **Deploy production** - same configuration  
✅ **All environments** use Vercel backend  
✅ **Backend connects** to permanent database  

---

**See [VERCEL_DEPLOYMENT_STEP_BY_STEP.md](./VERCEL_DEPLOYMENT_STEP_BY_STEP.md) for complete deployment guide.**

