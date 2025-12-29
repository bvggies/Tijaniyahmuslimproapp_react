# Permanent Database Configuration

## ⚠️ IMPORTANT: Permanent Database

**This database connection is the PERMANENT database for this project and must be used for ALL future endeavors.**

## Database Connection String

```
postgresql://neondb_owner:npg_Dq3XziHrt4xM@ep-broad-queen-ahyn14aw-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
```

## Database Details

- **Provider**: Neon PostgreSQL
- **Host**: `ep-broad-queen-ahyn14aw-pooler.c-3.us-east-1.aws.neon.tech`
- **Database**: `neondb`
- **Region**: US East 1 (AWS)
- **Connection Type**: Pooled (optimized for serverless)
- **SSL**: Required

## Usage

### All Environments Use This Database

- ✅ **Local Development** - Backend connects to permanent database
- ✅ **Expo Go** - Frontend → Backend → Permanent database
- ✅ **Testing** - All tests use permanent database
- ✅ **Production** - Vercel backend uses permanent database

### Local Development

The `.env` file in the `api/` directory should always contain:

```bash
DATABASE_URL="postgresql://neondb_owner:npg_Dq3XziHrt4xM@ep-broad-queen-ahyn14aw-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

### Production (Vercel)

Set the `DATABASE_URL` environment variable in Vercel dashboard to the same connection string above.

### Testing

Use the same database connection string for all testing environments.

## Important Notes

1. **DO NOT CHANGE** this database connection string
2. **DO NOT CREATE** new databases for this project
3. **ALWAYS USE** this connection string in all environments
4. **BACKUP** this connection string securely
5. All migrations and seeds should target this database

## Database Status

- ✅ Migrations applied
- ✅ Initial data seeded
- ✅ Ready for production use

## Connection String Format

For reference, the connection string format is:
```
postgresql://[username]:[password]@[host]/[database]?sslmode=require
```

## Security

- Keep the connection string secure
- Never commit the connection string to public repositories
- Use environment variables for all deployments
- The `.env` file is in `.gitignore` and should never be committed

---

**Last Updated**: 2025-01-27  
**Status**: Active and Permanent

