#!/bin/bash

echo "Building Coordle for production..."

# Install dependencies
echo "Installing API dependencies..."
cd apps/api && npm install

echo "Installing Web dependencies..."
cd ../web && npm install

# Build API
echo "🔨 Building API..."
cd ../api && npm run build

# Build Web
echo "🔨 Building Web..."
cd ../web && npm run build

echo "Build complete!"
echo "API built to: apps/api/dist/"
echo "Web built to: apps/web/dist/"
echo ""
echo "Ready to deploy to Vercel!"
echo "Run: vercel --prod"