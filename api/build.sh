#!/bin/bash
set -e

echo "=== Starting build process ==="

echo "Cleaning cache..."
rm -rf node_modules/.cache || true
rm -rf ~/.npm/_cacache || true

echo "Installing dependencies..."
npm ci --no-cache --verbose

echo "Generating Prisma client..."
npx prisma generate

echo "Building application..."
npm run build

echo "Verifying build..."
if [ -f "dist/main.js" ]; then
    echo "✓ Build successful - dist/main.js exists"
else
    echo "✗ Build failed - dist/main.js not found"
    exit 1
fi

echo "=== Build completed successfully! ==="
