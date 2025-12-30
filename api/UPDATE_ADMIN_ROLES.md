# Update Admin Roles - Quick Fix Guide

## Problem
The admin dashboard requires users to have a role of `ADMIN`, `MODERATOR`, `SCHOLAR`, `SUPPORT`, or `VIEWER`, but the database doesn't have a `role` field yet.

## Solution Applied
1. ✅ Added `UserRole` enum and `role` field to User model in Prisma schema
2. ✅ Updated seed file to create admin users with `ADMIN` role
3. ✅ Updated auth service to return `role` in login/signup responses
4. ✅ Added `/auth/me` endpoint for getting current user info

## Next Steps

### Option 1: Run Database Migration (Recommended for Production)

1. **Create and apply the migration:**
   ```bash
   cd api
   npx prisma migrate dev --name add_user_roles
   ```

2. **Update existing admin user (if it already exists):**
   ```bash
   npx prisma studio
   ```
   - Open the User table
   - Find `admin@tijaniyahpro.com`
   - Set `role` field to `ADMIN`
   - Save

3. **Or run the seed script to recreate users:**
   ```bash
   npm run db:seed
   ```

### Option 2: Quick SQL Update (If migration fails)

Run this SQL directly in your database:

```sql
-- Add role column if it doesn't exist
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "role" TEXT DEFAULT 'USER';

-- Create enum type if it doesn't exist
DO $$ BEGIN
    CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'MODERATOR', 'SCHOLAR', 'SUPPORT', 'VIEWER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Update existing admin user
UPDATE "User" SET "role" = 'ADMIN' WHERE "email" = 'admin@tijaniyahpro.com';

-- Update existing moderator user
UPDATE "User" SET "role" = 'MODERATOR' WHERE "email" = 'moderator@tijaniyahpro.com';
```

### Option 3: Use Prisma Studio (Easiest)

1. **Open Prisma Studio:**
   ```bash
   cd api
   npx prisma studio
   ```

2. **Navigate to User table**

3. **Find and update users:**
   - Find `admin@tijaniyahpro.com` → Set `role` to `ADMIN`
   - Find `moderator@tijaniyahpro.com` → Set `role` to `MODERATOR`

4. **Save changes**

## Test Login

After updating the database:

1. Go to admin dashboard: http://localhost:3000
2. Login with:
   - Email: `admin@tijaniyahpro.com`
   - Password: `admin123`

You should now be able to access the admin dashboard!

## For Vercel Deployment

After making these changes, you'll need to:

1. Push changes to GitHub
2. Vercel will automatically redeploy
3. Run the migration on Vercel (or update users via Prisma Studio with Vercel database connection)

## Troubleshooting

If you still get "Access denied":
- Check that the user exists in the database
- Verify the `role` field is set to `ADMIN` (not `USER`)
- Check browser console for API errors
- Verify the backend API is returning the role in the login response

