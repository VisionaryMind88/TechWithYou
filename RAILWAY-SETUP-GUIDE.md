# Railway Deployment Guide

## Step 1: Create Railway Project

1. Sign up/login at [Railway.app](https://railway.app/)
2. Click "New Project" and select "Deploy from GitHub repo"
3. Connect to your GitHub account and select your repository
4. Configure the project with the following settings:
   - Root Directory: `/` (root of the repository)
   - Build Command: `npm run build`
   - Start Command: `npm run start`

## Step 2: Configure Environment Variables

Add the following environment variables in the Railway dashboard:

```
# Application
PORT=5000
NODE_ENV=production

# Database
DATABASE_URL=<your-supabase-postgresql-url>

# Session
SESSION_SECRET=<strong-random-string>

# Firebase Admin
FIREBASE_API_KEY=<your-firebase-api-key>
FIREBASE_PROJECT_ID=techwithyouu
FIREBASE_AUTH_DOMAIN=techwithyouu.firebaseapp.com
FIREBASE_STORAGE_BUCKET=techwithyouu.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=161803725978
FIREBASE_APP_ID=1:161803725978:web:09518a312516edea2cc323
FIREBASE_MEASUREMENT_ID=G-CJ8T9FYM2V

# Frontend Environment Variables
VITE_FIREBASE_API_KEY=<your-firebase-api-key>
VITE_FIREBASE_AUTH_DOMAIN=techwithyouu.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=techwithyouu
VITE_FIREBASE_STORAGE_BUCKET=techwithyouu.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=161803725978
VITE_FIREBASE_APP_ID=1:161803725978:web:09518a312516edea2cc323
VITE_FIREBASE_MEASUREMENT_ID=G-CJ8T9FYM2V
VITE_GA_MEASUREMENT_ID=G-ZKETYKT5GG
```

## Step 3: Configure External Authentication

### Firebase Authentication

1. Go to Firebase Console → Authentication → Settings → Authorized domains
2. Add your Railway domain: `your-app-name.railway.app`

### OAuth Providers (Google, GitHub)

1. Google OAuth:
   - Go to Google Cloud Console → APIs & Services → Credentials
   - Edit your OAuth client
   - Add authorized redirect URIs: `https://your-app-name.railway.app/auth/google/callback`

2. GitHub OAuth:
   - Go to GitHub → Settings → Developer settings → OAuth Apps
   - Update the Authorization callback URL: `https://your-app-name.railway.app/auth/github/callback`

## Step 4: Configure Database Access

1. Ensure Supabase/PostgreSQL allows connections from Railway:
   - Go to Supabase dashboard → Settings → Database
   - Under "Connection Pooling", ensure "Connection String" points to your Supabase PostgreSQL instance
   - If using IP restrictions, add Railway's IP ranges (or temporarily disable IP restrictions for testing)

2. Verify the DATABASE_URL environment variable in Railway settings

## Step 5: Continuous Deployment Setup

For automatic deployment from Replit to Railway:

1. Connect your Replit project to GitHub:
   - In Replit, go to Version Control tab
   - Set up Git and connect to GitHub
   - Push your code to GitHub

2. Configure Railway for automatic deployment:
   - In Railway dashboard, go to project settings
   - Under "Deployments", enable "Auto Deploy"
   - Select the branch you want to deploy from (usually "main")

## Step 6: Monitoring and Debugging

1. Access logs in Railway dashboard:
   - Go to your project → Deployments → select the latest deployment → Logs
   - Monitor for any errors during build or runtime

2. Set up health checking:
   - Your application already has a health endpoint at `/api/health`
   - Railway will use this to monitor application health

## Step 7: Testing Deployed Application

Thoroughly test all aspects of your deployed application:

1. Authentication:
   - Test login/registration with email/password
   - Test OAuth authentication (Google, GitHub)
   - Verify sessions persist correctly

2. Database operations:
   - Verify all CRUD operations work as expected
   - Test database connections are stable

3. File uploads:
   - Test uploading files to Firebase Storage
   - Verify files are correctly stored and retrieved

4. Real-time features:
   - Test real-time chat functionality
   - Verify notifications work properly

5. Cross-device testing:
   - Test on desktop and mobile devices
   - Verify responsive design works correctly

## Troubleshooting Common Issues

1. **Authentication fails on Railway but works locally:**
   - Check authorized domains in Firebase
   - Verify OAuth callback URLs
   - Check environment variables for typos

2. **Database connection issues:**
   - Verify DATABASE_URL is correctly set
   - Check if IP restrictions are blocking Railway
   - Test database connection with `pg_isready` command

3. **Build failures:**
   - Check Railway build logs for specific errors
   - Verify all dependencies are properly listed in package.json
   - Check for environment variables used during build process

4. **Runtime errors:**
   - Check Railway logs
   - Verify all required environment variables are set
   - Check for CORS issues if accessing external APIs

## Security Considerations

1. Never commit sensitive information to your repository
2. Use environment variables for all secrets
3. Regularly rotate API keys and secrets
4. Set up proper CORS configurations for your production domain
5. Implement rate limiting for your API endpoints
6. Regularly update dependencies to patch security vulnerabilities