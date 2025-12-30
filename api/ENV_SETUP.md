# Environment Setup

## ⚠️ PERMANENT DATABASE

**This is the PERMANENT database for this project. DO NOT CHANGE.**

See [docs/PERMANENT_DATABASE.md](../docs/PERMANENT_DATABASE.md) for details.

## Quick Setup

Create a `.env` file in the `api/` directory with the following content:

```bash
# Neon PostgreSQL Database (PERMANENT - DO NOT CHANGE)
DATABASE_URL="postgresql://neondb_owner:npg_Dq3XziHrt4xM@ep-broad-queen-ahyn14aw-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"

# Application Configuration
NODE_ENV=development
PORT=3000

# JWT Configuration
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=*

# API Configuration
API_URL=http://localhost:3000

# Cloudinary Configuration (Image Uploads)
CLOUDINARY_CLOUD_NAME=dplvxodnd
CLOUDINARY_API_KEY=373862586681547
CLOUDINARY_API_SECRET=Ca4ClORTAdJA8-626EcAhD5CYSg

# Groq API Configuration (AI Noor)
GROQ_API_KEY=your_groq_api_key_here
```

## Generate JWT Secret

Run this command to generate a secure JWT secret:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and replace `your-super-secret-jwt-key-change-this-in-production` in your `.env` file.

## Setup Database

After creating the `.env` file:

```bash
npm install
npm run db:setup
```

This will:
1. Install dependencies
2. Generate Prisma client
3. Run database migrations
4. Verify the connection

## For Vercel Deployment

Set these environment variables in Vercel dashboard:
- `DATABASE_URL` - Same connection string as above
- `JWT_SECRET` - Your generated secret
- `CORS_ORIGIN` - Your frontend URL or `*`
- `NODE_ENV` - `production`
- `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Your Cloudinary API key
- `CLOUDINARY_API_SECRET` - Your Cloudinary API secret
- `GROQ_API_KEY` - Your Groq API key for AI Noor (get from https://console.groq.com/)

See [docs/VERCEL_DEPLOYMENT.md](../docs/VERCEL_DEPLOYMENT.md) for details.

## Cloudinary Setup

To enable image uploads, you need to create an unsigned upload preset in Cloudinary:

1. Log in to [Cloudinary Console](https://cloudinary.com/console)
2. Go to Settings → Upload
3. Click "Add upload preset"
4. Set:
   - Preset name: `tijaniyah_unsigned`
   - Signing Mode: `Unsigned`
   - Folder: `tijaniyah`
5. Save the preset

This allows the mobile app to upload images directly to Cloudinary without server-side signing.

