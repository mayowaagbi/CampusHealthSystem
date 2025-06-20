# Campus Health System

A comprehensive health management system for educational institutions, featuring real-time health monitoring, appointment scheduling, emergency services, and wellness tracking.

## 🚀 Features

- **Student Dashboard**: Health tracking, appointment booking, wellness goals
- **Healthcare Provider Portal**: Patient management, appointment scheduling, health records
- **Admin Dashboard**: System management, analytics, user administration
- **Real-time Notifications**: WebSocket-based alerts and emergency notifications
- **Ambulance Requests**: Emergency service coordination
- **Health Analytics**: Data visualization and reporting
- **Mobile-Responsive**: Works on all devices

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v13 or higher)
- **Redis** (for rate limiting and caching)

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd campus-health-system
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your configuration
# Make sure to set:
# - DATABASE_URL
# - JWT_ACCESS_SECRET (32+ characters)
# - JWT_REFRESH_SECRET (32+ characters)
# - SMTP credentials for email
# - Twilio credentials for SMS (optional)

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# (Optional) Seed the database
npx prisma db seed
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Edit .env.local with your configuration
# Make sure VITE_API_BASE_URL matches your backend URL
```

## 🔧 Environment Configuration

### Backend (.env)

```env
NODE_ENV=production
PORT=4000
DATABASE_URL="postgresql://username:password@localhost:5432/campus_health"
JWT_ACCESS_SECRET=your_very_long_random_access_secret_here_minimum_32_characters
JWT_REFRESH_SECRET=your_very_long_random_refresh_secret_here_minimum_32_characters
FRONTEND_URL=http://localhost:5173
# ... (see .env.example for full configuration)
```

### Frontend (.env.local)

```env
VITE_API_BASE_URL=http://localhost:4000
VITE_SOCKET_SERVER_URL=http://localhost:4000
```

## 🚀 Development

### Start Backend Server

```bash
cd backend
npm run dev
```

The backend will start at `http://localhost:4000`

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will start at `http://localhost:5173`

## 📦 Production Deployment

### Backend Production Build

```bash
cd backend

# Install production dependencies
npm ci --only=production

# Start the server
npm start
```

### Frontend Production Build

```bash
cd frontend

# Build for production
npm run build

# Preview the build (optional)
npm run preview
```

### Environment Variables for Production

Make sure to set the following environment variables in your production environment:

**Backend:**

- `NODE_ENV=production`
- `DATABASE_URL` (production database)
- `JWT_ACCESS_SECRET` & `JWT_REFRESH_SECRET` (secure random strings)
- `FRONTEND_URL` (your frontend domain)

**Frontend:**

- `VITE_API_BASE_URL` (your backend API URL)
- `VITE_SOCKET_SERVER_URL` (your backend WebSocket URL)

## 🐳 Docker Deployment

### Using Docker Compose

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Individual Docker Builds

```bash
# Backend
cd backend
docker build -t campus-health-backend .
docker run -p 4000:4000 --env-file .env campus-health-backend

# Frontend
cd frontend
docker build -t campus-health-frontend .
docker run -p 5173:5173 campus-health-frontend
```

## ☁️ Railway Deployment (Recommended)

Railway is a modern cloud platform that makes deployment simple and automatic.

### Quick Railway Deploy

1. **Push to GitHub**: Ensure your code is in a GitHub repository
2. **Go to Railway**: Visit [railway.app](https://railway.app) and sign in
3. **New Project**: Click "New Project" → "Deploy from GitHub repo"
4. **Deploy Backend**:
   - Select your repo and choose `backend` folder
   - Add environment variables (see RAILWAY.md for details)
   - Add PostgreSQL database service
5. **Deploy Frontend**:
   - Add new service from same repo, choose `frontend` folder
   - Configure frontend environment variables

### Railway Environment Variables

**Backend:**

```env
NODE_ENV=production
JWT_ACCESS_SECRET=your_32_character_secret
JWT_REFRESH_SECRET=your_different_32_character_secret
FRONTEND_URL=https://your-frontend.railway.app
```

**Frontend:**

```env
VITE_API_BASE_URL=https://your-backend.railway.app
VITE_SOCKET_SERVER_URL=https://your-backend.railway.app
```

📖 **See [RAILWAY.md](./RAILWAY.md) for detailed Railway deployment guide**

## 🔧 Common Issues & Solutions

### Issue: Import/Export Errors

**Problem**: Module import mismatches causing deployment failures.

**Fixed Issues:**

- ✅ Fixed `module.export` → `module.exports` typos
- ✅ Fixed case sensitivity issues in service imports
- ✅ Fixed broken model imports using Prisma directly
- ✅ Fixed port inconsistencies between frontend files
- ✅ Made API URLs environment-configurable

### Issue: Database Connection

**Problem**: Cannot connect to database.

**Solution:**

1. Ensure PostgreSQL is running
2. Check `DATABASE_URL` in `.env`
3. Run `npx prisma migrate deploy`
4. Check network connectivity

### Issue: WebSocket Connection

**Problem**: Real-time features not working.

**Solution:**

1. Ensure backend is running on correct port
2. Check `VITE_SOCKET_SERVER_URL` in frontend `.env`
3. Verify CORS settings in backend

### Issue: Authentication Errors

**Problem**: JWT token issues.

**Solution:**

1. Ensure `JWT_ACCESS_SECRET` is at least 32 characters
2. Check token expiration settings
3. Clear browser storage and login again

## 📁 Project Structure

```
campus-health-system/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── services/        # Business logic
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Express middleware
│   │   ├── utils/           # Utility functions
│   │   └── validations/     # Input validation
│   ├── prisma/             # Database schema & migrations
│   └── uploads/            # File uploads
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   ├── context/        # React context
│   │   ├── adapters/       # API adapters
│   │   └── lib/            # Utilities
│   └── public/            # Static assets
└── docs/                  # Documentation
```

## 🔑 Default Users

After seeding the database, you can login with:

**Admin:**

- Email: admin@campus.edu
- Password: admin123

**Healthcare Provider:**

- Email: provider@campus.edu
- Password: provider123

**Student:**

- Email: student@campus.edu
- Password: student123

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📖 API Documentation

API documentation is available at `http://localhost:4000/api/docs` when running in development mode.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [Common Issues](#-common-issues--solutions) section
2. Review the logs for error messages
3. Ensure all environment variables are correctly set
4. Verify database connectivity
5. Check that all required services (PostgreSQL, Redis) are running

## 🔄 Recent Fixes Applied

The following deployment issues have been resolved:

- ✅ **Export Issues**: Fixed `module.export` typos across service files
- ✅ **Import Mismatches**: Fixed broken model imports and destructuring issues
- ✅ **Case Sensitivity**: Fixed inconsistent file import casing
- ✅ **Database Models**: Updated services to use Prisma directly instead of broken model classes
- ✅ **Service Patterns**: Standardized service export patterns (class vs instance)
- ✅ **Configuration**: Made API URLs environment-configurable for different deployments
- ✅ **Port Conflicts**: Fixed port inconsistencies between frontend configuration files
- ✅ **TypeScript Issues**: Fixed incorrect exports in utility files

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] All environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates configured (for HTTPS)
- [ ] CORS settings updated for production domain
- [ ] File upload directories have proper permissions
- [ ] Redis server is running (for rate limiting)
- [ ] Email service configured and tested
- [ ] SMS service configured (if using Twilio)
- [ ] Monitoring and logging set up
- [ ] Backup strategy implemented
