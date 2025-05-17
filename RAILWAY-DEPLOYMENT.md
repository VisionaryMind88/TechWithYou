# Railway Deployment Guide for TechWithYou Application

This guide will help you deploy the TechWithYou application to Railway and address the specific requirements you mentioned.

## 1. Railway Configuration Setup

### Environment Variables

Set the following environment variables in Railway's dashboard:

```
# Application
PORT=5000
NODE_ENV=production

# Database
DATABASE_URL=<your-supabase-postgres-url>

# Firebase config
FIREBASE_API_KEY=<your-firebase-api-key>
FIREBASE_PROJECT_ID=techwithyouu
FIREBASE_AUTH_DOMAIN=techwithyouu.firebaseapp.com
FIREBASE_STORAGE_BUCKET=techwithyouu.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=161803725978
FIREBASE_APP_ID=1:161803725978:web:09518a312516edea2cc323
FIREBASE_MEASUREMENT_ID=G-CJ8T9FYM2V

# Google Analytics
GA_MEASUREMENT_ID=G-ZKETYKT5GG

# Session secret - generate a strong secret
SESSION_SECRET=<generate-a-strong-secret-key>

# Vite environment variables (for frontend)
VITE_FIREBASE_API_KEY=<your-firebase-api-key>
VITE_FIREBASE_AUTH_DOMAIN=techwithyouu.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=techwithyouu
VITE_FIREBASE_STORAGE_BUCKET=techwithyouu.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=161803725978
VITE_FIREBASE_APP_ID=1:161803725978:web:09518a312516edea2cc323
VITE_FIREBASE_MEASUREMENT_ID=G-CJ8T9FYM2V
VITE_GA_MEASUREMENT_ID=G-ZKETYKT5GG
```

### Build and Start Commands

Railway will use these commands defined in your railway.toml:
- Build command: `npm run build`
- Start command: `npm run start`

## 2. Fix External Access to Railway UI

### Configure Authorization Domains for Firebase

1. Go to Firebase Console > Authentication > Settings > Authorized domains
2. Add your Railway domain (e.g., `your-app-name.railway.app`) to the list of authorized domains

### Configure OAuth Redirect URLs

1. For Google authentication:
   - Go to Google Cloud Console > APIs & Services > Credentials
   - Edit your OAuth 2.0 Client ID
   - Add your Railway URL to authorized redirect URIs: `https://your-app-name.railway.app/auth/google/callback`

2. For GitHub authentication:
   - Go to GitHub Developer Settings > OAuth Apps
   - Edit your application
   - Add your Railway URL to authorized callback URLs: `https://your-app-name.railway.app/auth/github/callback`

## 3. Setting Up Continuous Deployment from Replit to Railway

### GitHub Integration Method

1. Push your Replit project to a GitHub repository
2. Connect Railway to your GitHub repository
3. Configure Railway to automatically deploy when changes are pushed to the main branch

### GitHub Actions for Automatic Deployment

Create a GitHub workflow file (.github/workflows/deploy.yml):

```yaml
name: Deploy to Railway

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Install Railway CLI
        run: npm i -g @railway/cli

      - name: Deploy
        run: railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

You'll need to create a Railway token and add it as a GitHub secret.

## 4. Database Integration with Railway

### Supabase PostgreSQL Setup

1. Make sure your Supabase project allows connections from Railway IP addresses
2. Set the correct DATABASE_URL in Railway environment variables
3. Configure your application to use the database URL from environment variables

## 5. Debugging and Monitoring

1. Set up Railway logging to capture application logs
2. Consider adding an error monitoring service like Sentry
3. Set up health checks (already configured in railway.toml)

## 6. Testing After Deployment

1. Test authentication (both Google and GitHub sign-in)
2. Test all CRUD operations on the database
3. Test file uploads to Firebase Storage
4. Verify that real-time features work correctly
5. Test on different devices and browsers

## 7. Common Issues and Troubleshooting

### Connection Issues
- If you see Firebase connection errors, verify that your Firebase API key is correctly set
- For database connection issues, check that your PostgreSQL connection string is correct and that network access is allowed

### Build Failures
- If the build fails, check the build logs for errors
- Make sure all dependencies are properly listed in package.json

### Authentication Problems
- Verify that all OAuth callback URLs are correctly configured
- Check that Firebase authorized domains include your Railway domain

### Database Issues
- Ensure your database credentials are correct
- Check if your Supabase project has any IP restrictions that might block Railway

## 8. Security Considerations

1. Never commit sensitive information like API keys or database credentials to the repository
2. Use environment variables for all sensitive information
3. Set a strong SESSION_SECRET for Express session management
4. Consider setting up CORS to restrict access to your API