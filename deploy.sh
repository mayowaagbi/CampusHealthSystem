#!/bin/bash

# Campus Health System Deployment Script

echo "🏥 Campus Health System Deployment"
echo "=================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create environment files if they don't exist
if [ ! -f "./backend/.env" ]; then
    echo "📝 Creating backend .env file from example..."
    cp ./backend/.env.example ./backend/.env
    echo "⚠️  Please edit ./backend/.env with your actual configuration before continuing!"
    read -p "Press enter to continue after editing the .env file..."
fi

if [ ! -f "./frontend/.env.local" ]; then
    echo "📝 Creating frontend .env.local file from example..."
    cp ./frontend/.env.example ./frontend/.env.local
fi

# Build and start services
echo "🐳 Building and starting Docker containers..."
docker-compose down
docker-compose build
docker-compose up -d

echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo "✅ Services are running!"
    echo ""
    echo "🌐 Access the application:"
    echo "   Frontend: http://localhost:5173"
    echo "   Backend API: http://localhost:4000"
    echo "   API Docs: http://localhost:4000/api/docs"
    echo ""
    echo "📊 View logs:"
    echo "   docker-compose logs -f"
    echo ""
    echo "🛑 Stop services:"
    echo "   docker-compose down"
else
    echo "❌ Some services failed to start. Check logs with:"
    echo "   docker-compose logs"
fi
