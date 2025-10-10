#!/bin/bash
set -e

echo "Cleaning cache..."
rm -rf node_modules/.cache || true
rm -rf ~/.npm/_cacache || true

echo "Installing dependencies..."
npm ci --no-cache

echo "Generating Prisma client..."
npx prisma generate

echo "Building application..."
npm run build

echo "Build completed successfully!"
