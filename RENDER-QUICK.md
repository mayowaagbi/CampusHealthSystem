# Quick Render Deployment

Deploy your Campus Health System to Render in under 15 minutes.

## Prerequisites

- GitHub account with your code pushed
- Render account (free at [render.com](https://render.com))

## Step-by-Step Deployment

### 1. Deploy Backend Web Service

1. Go to [render.com](https://render.com) → **New** → **Web Service**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `campus-health-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm ci && npx prisma generate`
   - **Start Command**: `npm start`
4. Click **Create Web Service**

### 2. Create PostgreSQL Database

1. **New** → **PostgreSQL**
2. Configure:
   - **Name**: `campus-health-db`
   - **Database**: `campus_health`
   - **User**: `campus_health_user`
3. Copy the **Internal Database URL**

### 3. Configure Backend Environment

In backend service → **Environment**:

```env
NODE_ENV=production
DATABASE_URL=<paste_internal_database_url_here>
JWT_ACCESS_SECRET=your_32_character_random_secret_here_123456789012
JWT_REFRESH_SECRET=your_different_32_character_secret_here_123456789012
FRONTEND_URL=https://campus-health-frontend.onrender.com
```

### 4. Deploy Frontend Static Site

1. **New** → **Static Site**
2. Connect same GitHub repository
3. Configure:
   - **Name**: `campus-health-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm ci && npm run build`
   - **Publish Directory**: `dist`

### 5. Configure Frontend Environment

In frontend service → **Environment**:

```env
VITE_API_BASE_URL=https://campus-health-backend.onrender.com
VITE_SOCKET_SERVER_URL=https://campus-health-backend.onrender.com
```

### 6. Update Backend Frontend URL

Go back to backend → **Environment** → Update:

```env
FRONTEND_URL=https://campus-health-frontend.onrender.com
```

**Note**: Replace service names with your actual Render URLs.

## You're Live! 🎉

Your app is now deployed:

- **Frontend**: `https://your-frontend-name.onrender.com`
- **Backend**: `https://your-backend-name.onrender.com`

## Default Login Credentials

- **Admin**: admin@campus.edu / admin123
- **Provider**: provider@campus.edu / provider123
- **Student**: student@campus.edu / student123

## Quick Troubleshooting

### Backend Won't Start?

- Check environment variables are set
- View logs in Render dashboard
- Verify database connection

### Frontend Shows Errors?

- Check VITE_API_BASE_URL points to backend
- Verify CORS settings in backend
- Check browser console

### Database Issues?

- Ensure DATABASE_URL is the internal URL
- Check database service is running
- Try redeploying backend

## Important Notes

### Free Tier Limitations

- **Backend sleeps** after 15 minutes of inactivity
- **Cold starts** may take 30+ seconds
- Consider **Starter plan ($7/month)** for production

### Performance Tips

- Upgrade to paid plan for production
- Use internal database URL for faster connections
- Monitor logs for performance issues

## Next Steps

1. **Custom Domain**: Add your own domain in service settings
2. **Email Setup**: Configure SMTP for email notifications
3. **Monitoring**: Set up uptime monitoring
4. **Backups**: Render handles database backups automatically

## Need Help?

- **Detailed Guide**: See [RENDER.md](./RENDER.md)
- **Render Docs**: [render.com/docs](https://render.com/docs)
- **Community**: [community.render.com](https://community.render.com)

Happy deploying! 🚀
