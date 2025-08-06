#!/bin/bash

# Voice Server API Deployment Script

echo "🚀 Deploying Voice Server API..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "📝 Don't forget to update the VITE_VOICE_SERVER_API_URL in your frontend environment variables!"
