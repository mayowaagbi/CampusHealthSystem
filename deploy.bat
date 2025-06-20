@echo off
REM Campus Health System Deployment Script for Windows

echo 🏥 Campus Health System Deployment
echo ==================================

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

REM Create environment files if they don't exist
if not exist ".\backend\.env" (
    echo 📝 Creating backend .env file from example...
    copy ".\backend\.env.example" ".\backend\.env"
    echo ⚠️  Please edit .\backend\.env with your actual configuration before continuing!
    pause
)

if not exist ".\frontend\.env.local" (
    echo 📝 Creating frontend .env.local file from example...
    copy ".\frontend\.env.example" ".\frontend\.env.local"
)

REM Build and start services
echo 🐳 Building and starting Docker containers...
docker-compose down
docker-compose build
docker-compose up -d

echo ⏳ Waiting for services to start...
timeout /t 10 /nobreak

REM Check if services are running
docker-compose ps | findstr "Up" >nul
if %errorlevel% equ 0 (
    echo ✅ Services are running!
    echo.
    echo 🌐 Access the application:
    echo    Frontend: http://localhost:5173
    echo    Backend API: http://localhost:4000
    echo    API Docs: http://localhost:4000/api/docs
    echo.
    echo 📊 View logs:
    echo    docker-compose logs -f
    echo.
    echo 🛑 Stop services:
    echo    docker-compose down
) else (
    echo ❌ Some services failed to start. Check logs with:
    echo    docker-compose logs
)

pause
