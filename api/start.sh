#!/bin/bash
set -e

echo "=== Starting application ==="

echo "Environment variables:"
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"
echo "DATABASE_URL: ${DATABASE_URL:0:50}..."

echo "Checking if dist/main.js exists..."
if [ -f "dist/main.js" ]; then
    echo "✓ dist/main.js found"
else
    echo "✗ dist/main.js not found - build may have failed"
    exit 1
fi

echo "Starting Node.js application..."
node dist/main.js
