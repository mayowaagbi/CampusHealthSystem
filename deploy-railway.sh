#!/bin/bash

# Railway Deployment Helper Script
# This script helps set up environment variables for Railway deployment

echo "🚂 Railway Deployment Helper"
echo "============================"

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "📦 Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Login to Railway
echo "🔑 Please login to Railway..."
railway login

echo ""
echo "📋 Required Environment Variables for Railway:"
echo ""
echo "Backend Service:"
echo "  NODE_ENV=production"
echo "  JWT_ACCESS_SECRET=<32_character_random_string>"
echo "  JWT_REFRESH_SECRET=<different_32_character_random_string>"
echo "  FRONTEND_URL=<your_frontend_railway_url>"
echo ""
echo "Frontend Service:"
echo "  VITE_API_BASE_URL=<your_backend_railway_url>"
echo "  VITE_SOCKET_SERVER_URL=<your_backend_railway_url>"
echo ""
echo "💡 Tips:"
echo "  1. Deploy backend first to get its Railway URL"
echo "  2. Deploy frontend second and use backend URL"
echo "  3. Update backend FRONTEND_URL with frontend Railway URL"
echo "  4. Add PostgreSQL database service in Railway dashboard"
echo ""
echo "📖 For detailed instructions, see RAILWAY.md"
echo ""
echo "🌐 Railway Dashboard: https://railway.app/dashboard"
