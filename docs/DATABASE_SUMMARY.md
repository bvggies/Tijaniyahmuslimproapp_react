# Database Configuration Summary

## ⚠️ PERMANENT DATABASE

**This database connection is the PERMANENT database for this project and must be used for ALL future endeavors.**

**DO NOT CHANGE THIS CONNECTION STRING.**

See [PERMANENT_DATABASE.md](./PERMANENT_DATABASE.md) for complete documentation.

## Shared Neon PostgreSQL Database

This project uses a **single Neon PostgreSQL database** for all environments:
- ✅ Local Development
- ✅ Testing
- ✅ Production (Vercel)

## Connection String

```
postgresql://neondb_owner:npg_Dq3XziHrt4xM@ep-broad-queen-ahyn14aw-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
```

**Key Features:**
- **Pooled Connection**: Uses Neon's connection pooler (`-pooler` in hostname)
- **Serverless Optimized**: Perfect for Vercel serverless functions
- **SSL Required**: Connection requires SSL encryption
- **Region**: US East 1 (AWS)

## Setup

### Local Development

1. Create `.env` file in `api/` directory:
   ```bash
   DATABASE_URL="postgresql://neondb_owner:npg_Dq3XziHrt4xM@ep-broad-queen-ahyn14aw-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"
   ```

2. Run setup:
   ```bash
   cd api
   npm install
   npm run db:setup
   ```

### Vercel Production

Set `DATABASE_URL` environment variable in Vercel dashboard with the same connection string above.

## Important Notes

⚠️ **Permanent Database**: This is the permanent database. DO NOT create new databases or change this connection string.

✅ **Connection Pooling**: The connection string uses Neon's pooler, which is essential for serverless functions.

📚 **Documentation**: 
- [Permanent Database Details](./PERMANENT_DATABASE.md)
- [Detailed Setup Guide](./DATABASE_SETUP_NEON.md)
- [Vercel Deployment](./VERCEL_DEPLOYMENT.md)
- [Quick Environment Setup](../api/ENV_SETUP.md)

---

**Last Updated**: 2025-01-27  
**Status**: Active and Permanent
