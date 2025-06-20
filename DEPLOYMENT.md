# Pre-Deployment Checklist

## Issues Fixed ✅

### Backend Issues

- [x] Fixed `module.export` → `module.exports` typos in services
- [x] Fixed broken import in AnalyticsService (now uses Prisma directly)
- [x] Fixed broken import in HealthRecordService (now uses Prisma directly)
- [x] Fixed broken import in EmergencyService
- [x] Fixed case sensitivity issues in StudentService imports
- [x] Fixed typo: `ProfielModel` → `ProfileModel` in appointmentController
- [x] Fixed inconsistent service export patterns (ambulanceService)
- [x] Removed unnecessary `.js` extensions in require statements
- [x] Fixed import issues with missing/commented model classes

### Frontend Issues

- [x] Fixed API base URL inconsistencies (port 3000 vs 4000)
- [x] Made API URLs environment-configurable
- [x] Fixed incorrect exports in utils.ts file
- [x] Removed misplaced .env file from src directory

### Configuration Issues

- [x] Created proper .env.example files for both backend and frontend
- [x] Fixed port inconsistencies across configuration files
- [x] Made environment variables configurable for different deployments

## Deployment Readiness Checklist

### Environment Setup

- [ ] PostgreSQL database server running
- [ ] Redis server running (optional, for rate limiting)
- [ ] Environment variables configured in `.env` files
- [ ] JWT secrets generated (32+ characters each)
- [ ] Database URL configured correctly
- [ ] SMTP credentials configured (for email notifications)
- [ ] Twilio credentials configured (optional, for SMS)

### Database Setup

- [ ] Run `npx prisma generate` in backend
- [ ] Run `npx prisma migrate deploy` in backend
- [ ] (Optional) Run database seeding

### Security

- [ ] Change default JWT secrets
- [ ] Configure CORS for production domain
- [ ] Set up SSL certificates for HTTPS
- [ ] Configure firewall rules
- [ ] Set secure file upload permissions

### Production Considerations

- [ ] Configure reverse proxy (nginx/Apache)
- [ ] Set up process manager (PM2)
- [ ] Configure monitoring and logging
- [ ] Set up backup strategy
- [ ] Configure CDN for static assets (optional)

### Testing

- [ ] Backend starts without errors
- [ ] Frontend builds successfully
- [ ] Database connections work
- [ ] WebSocket connections work
- [ ] Email sending works
- [ ] File uploads work
- [ ] Authentication flows work

## Quick Start Commands

### Development

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

### Production

```bash
# Backend
cd backend
npm ci --only=production
npm start

# Frontend
cd frontend
npm ci
npm run build
npm run preview
```

### Docker

```bash
# Simple Docker deployment
docker-compose up -d

# Or use deployment scripts
./deploy.sh    # Linux/Mac
deploy.bat     # Windows
```

## Default Test Users

After database seeding:

- **Admin**: admin@campus.edu / admin123
- **Provider**: provider@campus.edu / provider123
- **Student**: student@campus.edu / student123

## URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000
- **API Documentation**: http://localhost:4000/api/docs

## Troubleshooting

### Common Issues

1. **Port conflicts**: Make sure ports 4000, 5173, 5432, 6379 are available
2. **Database connection**: Check DATABASE_URL and ensure PostgreSQL is running
3. **JWT errors**: Ensure JWT secrets are properly configured
4. **CORS errors**: Check FRONTEND_URL in backend .env
5. **WebSocket issues**: Verify socket server URL matches backend
