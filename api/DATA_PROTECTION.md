# Data Protection Policy

## 🔒 User Data Protection

**CRITICAL: All user data is protected and will NEVER be automatically deleted.**

## Protected Operations

The following operations are **SAFE** and will **preserve all user data**:

### ✅ Safe Commands

1. **`npm run db:seed`** - Creates missing demo users only, never deletes existing data
2. **`npm run db:migrate`** - Applies database migrations safely without deleting data
3. **`npm run db:deploy`** - Deploys migrations to production safely
4. **`npm run build`** - Builds the application, no database operations
5. **`npm run start:dev`** - Starts development server, no data deletion

### ⚠️ Dangerous Commands (Use with Extreme Caution)

1. **`npm run db:reset`** - ⚠️ **DELETES ALL DATA**
   - Requires `FORCE_RESET=true` environment variable
   - **NEVER use in production**
   - Only for development/testing with empty databases

## Seed Script Behavior

The seed script (`api/prisma/seed.ts`) is **completely safe**:

- ✅ **Never deletes users** - All existing user accounts are preserved
- ✅ **Never deletes data** - All posts, comments, journals, etc. are preserved
- ✅ **Only creates missing demo users** - Creates demo/admin/moderator accounts if they don't exist
- ✅ **Updates roles safely** - Ensures admin/moderator users have correct roles without deleting them
- ✅ **Skips existing data** - Only creates sample posts/comments if none exist

## Database Migrations

Database migrations are **safe**:
- They only **add or modify** tables and columns
- They **never delete** user data
- They can be run safely in production

## Production Safety

In production:
- ✅ All user data is preserved across deployments
- ✅ Seed script can be run safely (won't delete anything)
- ✅ Migrations are applied without data loss
- ✅ Builds and deployments don't affect user data

## Development Safety

In development:
- ✅ User data persists across app restarts
- ✅ Seed script preserves existing data
- ⚠️ Only use `db:reset` if you need a completely fresh database (requires `FORCE_RESET=true`)

## What Gets Deleted?

**Nothing is automatically deleted.** The only deletions that occur are:

1. **User-initiated deletions** (via the app):
   - Users deleting their own posts
   - Users deleting their own bookmarks
   - Users deleting their own journal entries
   - These are intentional user actions, not automatic

2. **Admin-initiated deletions** (via admin dashboard):
   - Admins deleting channels
   - Admins deleting campaigns
   - These are intentional admin actions

3. **Manual database resets** (requires explicit confirmation):
   - `npm run db:reset` with `FORCE_RESET=true`
   - This is a manual operation that requires explicit confirmation

## Best Practices

1. ✅ **Never run `db:reset` in production**
2. ✅ **Always backup before any destructive operation**
3. ✅ **Use the seed script freely** - it's completely safe
4. ✅ **Run migrations confidently** - they're safe
5. ✅ **User data is always preserved** by default

## Troubleshooting

If you're experiencing data loss:

1. **Check if `FORCE_RESET=true` was set** - this would allow resets
2. **Verify database connection** - ensure you're using the correct database
3. **Check deployment logs** - see if any reset commands were run
4. **Review seed script** - it should never delete data (and now it doesn't)

## Summary

**All user data is protected by default. No automatic deletions occur. The seed script is completely safe and will preserve all existing data.**

