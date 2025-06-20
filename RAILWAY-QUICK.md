# Quick Railway Deployment

Follow these steps to deploy Campus Health System to Railway in under 10 minutes.

## Prerequisites

- GitHub account with your code pushed
- Railway account (free at [railway.app](https://railway.app))

## Step-by-Step Deployment

### 1. Deploy Backend First

1. Go to [railway.app](https://railway.app) → **New Project**
2. Choose **Deploy from GitHub repo**
3. Select your repository
4. Choose **backend** folder
5. Railway will automatically deploy

### 2. Add Database

1. In your Railway project, click **New Service**
2. Select **Database** → **PostgreSQL**
3. Database will be automatically connected to backend

### 3. Configure Backend Environment

Click on backend service → **Variables** tab → Add:

```
NODE_ENV=production
JWT_ACCESS_SECRET=your_32_character_random_secret_here_123456789
JWT_REFRESH_SECRET=your_different_32_character_secret_here_123456789
FRONTEND_URL=https://your-frontend-will-go-here.railway.app
```

### 4. Deploy Frontend

1. Click **New Service** in same project
2. Choose **GitHub repo** again (same repository)
3. Select **frontend** folder
4. Railway will automatically deploy

### 5. Configure Frontend Environment

Click on frontend service → **Variables** tab → Add:

```
VITE_API_BASE_URL=https://your-backend-domain.railway.app
VITE_SOCKET_SERVER_URL=https://your-backend-domain.railway.app
```

**Note:** Replace `your-backend-domain` with the actual URL from step 1.

### 6. Update Backend Frontend URL

Go back to backend service → **Variables** → Update:

```
FRONTEND_URL=https://your-frontend-domain.railway.app
```

## You're Done! 🎉

Your app is now live at:

- **Frontend**: `https://your-frontend-domain.railway.app`
- **Backend**: `https://your-backend-domain.railway.app`

## Default Login Credentials

After first deployment, you can login with:

- **Admin**: admin@campus.edu / admin123
- **Provider**: provider@campus.edu / provider123
- **Student**: student@campus.edu / student123

## Troubleshooting

### App not loading?

- Check service logs in Railway dashboard
- Verify environment variables are set correctly
- Ensure both services are deployed successfully

### CORS errors?

- Make sure `FRONTEND_URL` in backend matches frontend Railway domain exactly
- Check browser console for specific error messages

### Database issues?

- Verify PostgreSQL service is running
- Check backend logs for connection errors

## Need Help?

- See [RAILWAY.md](./RAILWAY.md) for detailed guide
- Check Railway docs: [docs.railway.app](https://docs.railway.app)
- Join Railway Discord: [discord.gg/railway](https://discord.gg/railway)
