# Render Deployment Guide

Deploy your Campus Health System to Render - a modern cloud platform with automatic builds and deployments.

## Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **GitHub Account**: Your code should be in a GitHub repository
3. **PostgreSQL Database**: We'll set this up on Render

## Deployment Steps

### Step 1: Deploy Backend Web Service

1. Go to [render.com](https://render.com) and sign in
2. Click **New** → **Web Service**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `campus-health-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm ci && npx prisma generate`
   - **Start Command**: `npm start`
   - **Instance Type**: Free tier or Starter ($7/month)

### Step 2: Create PostgreSQL Database

1. In Render dashboard, click **New** → **PostgreSQL**
2. Configure database:
   - **Name**: `campus-health-db`
   - **Database**: `campus_health`
   - **User**: `campus_health_user`
   - **Region**: Same as your web service
3. Note the **Internal Database URL** - you'll need this for environment variables

### Step 3: Configure Backend Environment Variables

In your backend service settings, add these environment variables:

**Required Variables:**

```env
NODE_ENV=production
DATABASE_URL=<Internal_Database_URL_from_Step_2>
JWT_ACCESS_SECRET=your_32_character_random_string_here
JWT_REFRESH_SECRET=your_different_32_character_random_string
FRONTEND_URL=https://your-frontend-name.onrender.com
```

**Optional Variables:**

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_number
```

### Step 4: Deploy Frontend Static Site

1. Click **New** → **Static Site**
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `campus-health-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm ci && npm run build`
   - **Publish Directory**: `dist`
   - **Auto-Deploy**: Yes

### Step 5: Configure Frontend Environment Variables

In your frontend service settings, add:

```env
VITE_API_BASE_URL=https://your-backend-name.onrender.com
VITE_SOCKET_SERVER_URL=https://your-backend-name.onrender.com
```

**Note**: Replace the URLs with your actual Render service URLs.

### Step 6: Update Backend CORS Settings

After getting your frontend URL, update the backend environment variable:

```env
FRONTEND_URL=https://your-frontend-name.onrender.com
```

## Environment Variables Reference

### Backend Environment Variables

| Variable             | Description           | Required | Example                    |
| -------------------- | --------------------- | -------- | -------------------------- |
| `NODE_ENV`           | Environment mode      | Yes      | `production`               |
| `DATABASE_URL`       | PostgreSQL connection | Yes      | Provided by Render         |
| `JWT_ACCESS_SECRET`  | JWT signing secret    | Yes      | `your_32_char_secret`      |
| `JWT_REFRESH_SECRET` | JWT refresh secret    | Yes      | `your_32_char_secret`      |
| `FRONTEND_URL`       | Frontend domain       | Yes      | `https://app.onrender.com` |
| `SMTP_HOST`          | Email server host     | No       | `smtp.gmail.com`           |
| `SMTP_PORT`          | Email server port     | No       | `587`                      |
| `SMTP_USER`          | Email username        | No       | `your_email@gmail.com`     |
| `SMTP_PASS`          | Email password        | No       | `your_app_password`        |

### Frontend Environment Variables

| Variable                 | Description          | Required | Example                    |
| ------------------------ | -------------------- | -------- | -------------------------- |
| `VITE_API_BASE_URL`      | Backend API URL      | Yes      | `https://api.onrender.com` |
| `VITE_SOCKET_SERVER_URL` | WebSocket server URL | Yes      | `https://api.onrender.com` |

## Database Setup

### Automatic Migrations

Render will automatically run database migrations when your backend deploys, thanks to the Prisma generate command in the build process.

### Manual Database Operations

If you need to run manual operations:

1. Go to your backend service in Render
2. Open the **Shell** tab
3. Run commands like:
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

## Custom Domains (Optional)

### Backend Custom Domain

1. Go to backend service → **Settings** → **Custom Domains**
2. Add your domain (e.g., `api.yourdomain.com`)
3. Configure DNS with the provided CNAME

### Frontend Custom Domain

1. Go to frontend service → **Settings** → **Custom Domains**
2. Add your domain (e.g., `yourdomain.com`)
3. Configure DNS with the provided CNAME

## Troubleshooting

### Common Issues

#### 1. Build Failures

**Problem**: `npm ci` fails or Prisma errors
**Solutions**:

- Check Node.js version (should be 18+)
- Verify all dependencies are in `package.json`
- Check build logs for specific errors

#### 2. Database Connection Issues

**Problem**: Backend can't connect to database
**Solutions**:

- Verify `DATABASE_URL` is set correctly
- Check database service is running
- Ensure database is in same region as backend

#### 3. CORS Errors

**Problem**: Frontend can't connect to backend
**Solutions**:

- Verify `FRONTEND_URL` in backend matches frontend URL exactly
- Check both services are using HTTPS
- Ensure CORS settings allow your frontend domain

#### 4. Static Site Routing Issues

**Problem**: Frontend routes don't work (404 on refresh)
**Solutions**:

- Verify `render.yaml` has correct redirect rules
- Check `publishDir` is set to `dist`
- Ensure SPA redirect is configured

#### 5. Environment Variables Not Working

**Problem**: App not using environment variables
**Solutions**:

- Frontend: Variables must start with `VITE_`
- Backend: Check variables are set in Render dashboard
- Restart services after changing variables

### Performance Optimization

#### Backend Optimization

1. **Upgrade Plan**: Free tier sleeps after 15 minutes - consider Starter plan
2. **Database**: Use connection pooling for better performance
3. **Caching**: Implement Redis for session caching

#### Frontend Optimization

1. **CDN**: Render automatically provides CDN for static sites
2. **Compression**: Enable gzip compression (automatic)
3. **Caching**: Configure proper cache headers

### Monitoring and Logs

#### Viewing Logs

1. Go to your service in Render dashboard
2. Click **Logs** tab to view real-time logs
3. Use filters to find specific issues

#### Health Checks

- Backend: `https://your-backend.onrender.com/health`
- Frontend: `https://your-frontend.onrender.com`

#### Metrics

Render provides basic metrics:

- Response times
- Error rates
- Memory usage
- CPU usage

## Scaling and Pricing

### Free Tier Limitations

- **Web Services**: 750 hours/month (sleeps after 15 min inactivity)
- **Bandwidth**: 100GB/month
- **Build Time**: 500 build hours/month

### Paid Plans

- **Starter ($7/month)**: No sleeping, faster builds
- **Standard ($25/month)**: More resources, priority support
- **Pro ($85/month)**: Advanced features, autoscaling

### Scaling Tips

1. **Horizontal Scaling**: Multiple instances (paid plans)
2. **Vertical Scaling**: Increase instance size
3. **Database**: Upgrade database plan for more connections
4. **Caching**: Implement Redis for better performance

## Security Best Practices

### Environment Variables

- Never commit real secrets to Git
- Use strong, unique JWT secrets (32+ characters)
- Rotate secrets regularly
- Use different secrets for different environments

### Database Security

- Use strong database passwords
- Enable SSL connections (default on Render)
- Regular backups (automatic on Render)
- Monitor for unusual activity

### Application Security

- Keep dependencies updated
- Use HTTPS only (automatic on Render)
- Implement rate limiting
- Validate all inputs
- Sanitize data before database operations

## Backup and Recovery

### Database Backups

Render automatically backs up PostgreSQL databases:

- **Free**: 7 days retention
- **Paid**: Up to 30 days retention

### Manual Backups

```bash
# In your backend service shell
pg_dump $DATABASE_URL > backup.sql
```

### Restore Process

1. Create new database service
2. Update `DATABASE_URL` environment variable
3. Run migrations: `npx prisma migrate deploy`
4. Restore data if needed

## Support and Resources

- **Render Documentation**: [render.com/docs](https://render.com/docs)
- **Community**: [community.render.com](https://community.render.com)
- **Status Page**: [status.render.com](https://status.render.com)
- **Support**: Available through dashboard (paid plans get priority)

## Production Checklist

Before going live:

- [ ] Backend web service deployed and healthy
- [ ] PostgreSQL database created and connected
- [ ] Frontend static site deployed
- [ ] All environment variables configured
- [ ] Custom domains configured (if needed)
- [ ] SSL certificates active (automatic)
- [ ] Database migrations applied
- [ ] Test user authentication flow
- [ ] Verify real-time features work
- [ ] Test file upload functionality
- [ ] Monitor logs for errors
- [ ] Set up uptime monitoring
- [ ] Configure email notifications
- [ ] Test SMS functionality (if enabled)
- [ ] Performance testing completed
- [ ] Backup strategy confirmed

## Migration from Other Platforms

If migrating from Heroku, Vercel, or other platforms:

1. **Export Data**: Backup your existing database
2. **Update Environment**: Configure Render environment variables
3. **Test Deployment**: Deploy to staging first
4. **DNS Update**: Point your domain to Render
5. **Monitor**: Watch logs during migration
6. **Rollback Plan**: Keep old platform ready as fallback

Your Campus Health System is now ready for production on Render! 🚀
