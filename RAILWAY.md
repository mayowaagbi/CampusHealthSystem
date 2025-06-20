# Railway Deployment Guide

This guide will help you deploy the Campus Health System to Railway, a modern cloud platform.

## Prerequisites

1. **Railway Account**: Sign up at [railway.app](https://railway.app)
2. **GitHub Account**: Your code should be in a GitHub repository
3. **Railway CLI** (optional): Install with `npm install -g @railway/cli`

## Deployment Steps

### Option 1: Deploy via Railway Dashboard (Recommended)

#### Step 1: Prepare Your Repository

1. Push your code to GitHub
2. Ensure all the Railway configuration files are included:
   - `backend/railway.json`
   - `frontend/railway.json`
   - `backend/nixpacks.toml`
   - `frontend/nixpacks.toml`

#### Step 2: Deploy Backend

1. Go to [railway.app](https://railway.app) and sign in
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Railway will detect the monorepo structure
6. Select the **backend** folder as the root directory
7. Railway will automatically detect it's a Node.js project

#### Step 3: Configure Backend Environment Variables

In the Railway dashboard for your backend service, add these environment variables:

**Required Variables:**

```env
NODE_ENV=production
DATABASE_URL=[Railway will provide this when you add PostgreSQL]
JWT_ACCESS_SECRET=your_32_character_random_string_here
JWT_REFRESH_SECRET=your_different_32_character_random_string
FRONTEND_URL=https://your-frontend-domain.railway.app
```

**Optional Variables (if needed):**

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_number
```

#### Step 4: Add PostgreSQL Database

1. In your Railway project dashboard
2. Click "New Service"
3. Select "Database" → "PostgreSQL"
4. Railway will automatically create a `DATABASE_URL` environment variable
5. The backend will automatically connect to this database

#### Step 5: Deploy Frontend

1. In the same Railway project, click "New Service"
2. Select "GitHub repo" again
3. Choose the same repository
4. Select the **frontend** folder as the root directory
5. Railway will detect it's a Node.js/Vite project

#### Step 6: Configure Frontend Environment Variables

In the Railway dashboard for your frontend service, add:

```env
VITE_API_BASE_URL=https://your-backend-domain.railway.app
VITE_SOCKET_SERVER_URL=https://your-backend-domain.railway.app
```

**Note:** Replace `your-backend-domain` with the actual domain Railway provides for your backend service.

#### Step 7: Update Backend CORS

After getting your frontend URL, update the backend environment variable:

```env
FRONTEND_URL=https://your-frontend-domain.railway.app
```

### Option 2: Deploy via Railway CLI

#### Step 1: Install and Login

```bash
npm install -g @railway/cli
railway login
```

#### Step 2: Deploy Backend

```bash
cd backend
railway link
railway up
```

#### Step 3: Deploy Frontend

```bash
cd ../frontend
railway link
railway up
```

## Environment Variables Reference

### Backend Environment Variables

| Variable              | Description           | Required | Example                        |
| --------------------- | --------------------- | -------- | ------------------------------ |
| `NODE_ENV`            | Environment mode      | Yes      | `production`                   |
| `PORT`                | Server port           | No       | Railway sets automatically     |
| `DATABASE_URL`        | PostgreSQL connection | Yes      | Railway provides automatically |
| `JWT_ACCESS_SECRET`   | JWT signing secret    | Yes      | `your_32_char_secret`          |
| `JWT_REFRESH_SECRET`  | JWT refresh secret    | Yes      | `your_32_char_secret`          |
| `FRONTEND_URL`        | Frontend domain       | Yes      | `https://your-app.railway.app` |
| `SMTP_HOST`           | Email server host     | No       | `smtp.gmail.com`               |
| `SMTP_PORT`           | Email server port     | No       | `587`                          |
| `SMTP_USER`           | Email username        | No       | `your_email@gmail.com`         |
| `SMTP_PASS`           | Email password        | No       | `your_app_password`            |
| `TWILIO_ACCOUNT_SID`  | Twilio account ID     | No       | `AC123...`                     |
| `TWILIO_AUTH_TOKEN`   | Twilio auth token     | No       | `your_token`                   |
| `TWILIO_PHONE_NUMBER` | Twilio phone          | No       | `+1234567890`                  |

### Frontend Environment Variables

| Variable                 | Description          | Required | Example                       |
| ------------------------ | -------------------- | -------- | ----------------------------- |
| `VITE_API_BASE_URL`      | Backend API URL      | Yes      | `https://backend.railway.app` |
| `VITE_SOCKET_SERVER_URL` | WebSocket server URL | Yes      | `https://backend.railway.app` |

## Database Setup

Railway will automatically create and manage your PostgreSQL database. The migrations will run automatically when your backend deploys.

### Manual Database Operations (if needed)

If you need to run manual database operations:

1. Install Railway CLI: `npm install -g @railway/cli`
2. Link to your project: `railway link`
3. Run Prisma commands: `railway run npx prisma migrate deploy`

## Troubleshooting

### Common Issues

#### 1. Build Failures

**Problem**: Build fails with module errors
**Solution**: Ensure all dependencies are in `package.json`, not just `devDependencies`

#### 2. Database Connection Issues

**Problem**: Cannot connect to database
**Solution**:

- Check if PostgreSQL service is running in Railway dashboard
- Verify `DATABASE_URL` environment variable is set
- Ensure database migrations have run

#### 3. CORS Errors

**Problem**: Frontend can't connect to backend
**Solution**:

- Update `FRONTEND_URL` in backend environment variables
- Make sure URLs match exactly (including https://)

#### 4. WebSocket Connection Issues

**Problem**: Real-time features not working
**Solution**:

- Verify `VITE_SOCKET_SERVER_URL` points to backend domain
- Ensure both services are using HTTPS

#### 5. Environment Variable Issues

**Problem**: App not using environment variables
**Solution**:

- Frontend: Variables must start with `VITE_`
- Backend: Make sure variables are set in Railway dashboard
- Restart services after changing environment variables

### Logs and Debugging

View logs in Railway dashboard:

1. Go to your service
2. Click "Deployments" tab
3. Click on a deployment to view logs

Or use CLI:

```bash
railway logs
```

## Monitoring and Maintenance

### Health Checks

Railway automatically monitors your services. You can check status at:

- Backend: `https://your-backend.railway.app/health`
- Frontend: `https://your-frontend.railway.app`

### Scaling

Railway automatically scales based on traffic. For manual scaling:

1. Go to service settings
2. Adjust memory/CPU limits as needed

### Updates

To deploy updates:

1. Push changes to GitHub
2. Railway will automatically redeploy
3. Monitor deployment in dashboard

## Production Checklist

Before going live:

- [ ] All environment variables configured
- [ ] Database migrations applied
- [ ] CORS settings updated for production domain
- [ ] SSL/HTTPS working (Railway handles this automatically)
- [ ] Email service tested
- [ ] SMS service tested (if using)
- [ ] Real-time features tested
- [ ] File uploads working
- [ ] Performance tested
- [ ] Monitoring set up

## Cost Optimization

Railway offers:

- **Hobby Plan**: $5/month per service
- **Pro Plan**: $20/month per service with more resources

Tips to optimize costs:

1. Use Railway's PostgreSQL instead of external database
2. Combine services where possible
3. Monitor resource usage in dashboard
4. Use appropriate instance sizes

## Support

- **Railway Documentation**: [docs.railway.app](https://docs.railway.app)
- **Railway Discord**: [discord.gg/railway](https://discord.gg/railway)
- **Railway Status**: [status.railway.app](https://status.railway.app)
