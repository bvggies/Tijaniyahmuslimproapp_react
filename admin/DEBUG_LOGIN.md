# Debug Admin Login Issue

## Step 1: Check Network Tab

1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Try to login
4. Look for the `/auth/login` request
5. Check:
   - **Status Code**: Should be 200 (success) or 401/403 (error)
   - **Response**: Click on the request and check the "Response" tab
   - **Request Payload**: Verify email/password are being sent

## Step 2: Check Console for Actual Errors

Look for errors that mention:
- "Access denied"
- "Invalid credentials"
- "Network error"
- "CORS error"

## Step 3: Verify Backend is Running

The admin dashboard connects to: `https://tijaniyahmuslimproapp-backend.vercel.app`

Test the API directly:
```bash
curl -X POST https://tijaniyahmuslimproapp-backend.vercel.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@tijaniyahpro.com","password":"admin123"}'
```

## Step 4: Check Database Role Field

The most likely issue is that the database doesn't have the `role` field yet.

### Option A: Run Migration (Recommended)
```bash
cd api
npx prisma migrate dev --name add_user_roles
```

### Option B: Check if Role Field Exists
```bash
cd api
npx prisma studio
```
- Open User table
- Check if `role` column exists
- If not, you need to run the migration

### Option C: Update User Manually via SQL
```sql
-- Check if role column exists
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'User' AND column_name = 'role';

-- If it doesn't exist, add it:
ALTER TABLE "User" ADD COLUMN "role" TEXT DEFAULT 'USER';

-- Update admin user
UPDATE "User" SET "role" = 'ADMIN' WHERE "email" = 'admin@tijaniyahpro.com';
```

## Step 5: Verify User Exists

Check if the admin user exists in the database:
```bash
cd api
npx prisma studio
```
- Look for `admin@tijaniyahpro.com`
- Verify password hash exists
- Check if `role` is set to `ADMIN`

## Step 6: Check API Response

The login should return:
```json
{
  "accessToken": "...",
  "user": {
    "id": "...",
    "email": "admin@tijaniyahpro.com",
    "name": "Super Administrator",
    "role": "ADMIN"  // <-- This is required!
  }
}
```

If `role` is missing or `"USER"`, the login will fail with "Access denied".

## Common Issues

1. **"Access denied. Admin privileges required."**
   - User exists but `role` is `USER` or missing
   - Solution: Update user role to `ADMIN`

2. **"Invalid credentials"**
   - Wrong email/password
   - User doesn't exist
   - Solution: Run seed script or create user

3. **Network Error / CORS Error**
   - Backend not accessible
   - CORS not configured
   - Solution: Check backend URL in `.env.local`

4. **500 Internal Server Error**
   - Database migration not run
   - `role` field doesn't exist in database
   - Solution: Run migration

## Quick Fix Script

If you have database access, run this SQL:

```sql
-- Add role column if missing
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'User' AND column_name = 'role'
    ) THEN
        ALTER TABLE "User" ADD COLUMN "role" TEXT DEFAULT 'USER';
    END IF;
END $$;

-- Update admin user
UPDATE "User" SET "role" = 'ADMIN' WHERE "email" = 'admin@tijaniyahpro.com';

-- Verify
SELECT email, role FROM "User" WHERE "email" = 'admin@tijaniyahpro.com';
```

