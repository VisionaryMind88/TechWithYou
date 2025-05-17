# Railway Deployment Checklist

This guide contains all the steps needed to successfully deploy your application on Railway.

## Step 1: Environment Variables

In your Railway project settings, set these essential environment variables:

```
# Application Settings
NODE_ENV=production
PORT=5000

# Database (use your Supabase PostgreSQL URL)
DATABASE_URL=your_supabase_postgres_url

# Session Secret (generate a strong random string)
SESSION_SECRET=generate_strong_random_string

# Firebase Configuration
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_PROJECT_ID=techwithyouu
FIREBASE_AUTH_DOMAIN=techwithyouu.firebaseapp.com
FIREBASE_STORAGE_BUCKET=techwithyouu.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=161803725978
FIREBASE_APP_ID=1:161803725978:web:09518a312516edea2cc323
FIREBASE_MEASUREMENT_ID=G-CJ8T9FYM2V

# Frontend Firebase Config (same as above but with VITE_ prefix)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=techwithyouu.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=techwithyouu
VITE_FIREBASE_STORAGE_BUCKET=techwithyouu.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=161803725978
VITE_FIREBASE_APP_ID=1:161803725978:web:09518a312516edea2cc323
VITE_FIREBASE_MEASUREMENT_ID=G-CJ8T9FYM2V
VITE_GA_MEASUREMENT_ID=G-ZKETYKT5GG
```

## Step 2: Database Connection Issues

If you're experiencing database connection timeouts, try these solutions:

1. **Ensure your Supabase database accepts connections from Railway's IP range:**
   - Go to your Supabase dashboard
   - Navigate to Database → Settings → Network
   - Add Railway's IP addresses to the allowed list, or temporarily enable "Allow from all IPv4" (for testing only)
   
2. **Increase connection pool timeout settings:**
   - In your code, we've already added a simplified health check endpoint that doesn't depend on the database

## Step 3: Authentication Configuration

After deployment:

1. **Add your Railway domain to Firebase authorized domains:**
   - Go to the Firebase Console
   - Navigate to Authentication → Settings → Authorized domains
   - Add your Railway domain (e.g., web-production-9f664.up.railway.app)

2. **Update OAuth providers (if used):**
   - For Google and GitHub authentication, update callback URLs to include your Railway domain
   - Add authorized redirect URIs pointing to your Railway app

## Step 4: Deployment Troubleshooting

If deployment still fails:

1. **Check Railway logs extensively:**
   - Look for error messages in the deployment logs
   - Pay special attention to any database connection errors or port binding issues

2. **Test your app locally with production settings:**
   ```
   NODE_ENV=production npm run start
   ```
   
3. **Verify your database is accessible:**
   - Try connecting to your Supabase database from another location to verify it's accepting connections

4. **Check Railway service status:**
   - Visit Railway's status page to ensure there are no ongoing service disruptions

## Step 5: Post-Deployment Verification

After successful deployment:

1. **Test all authentication flows:**
   - Sign up, login, password reset
   - OAuth providers if used (Google, GitHub)

2. **Verify database operations:**
   - Create, read, update, delete operations
   - Check that data persists between app restarts

3. **Test file uploads:**
   - Ensure Firebase storage is working correctly

4. **Check all application features:**
   - Navigate through all pages
   - Test all forms and interactive elements

## Additional Resources

- [Railway Documentation](https://docs.railway.app/)
- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Supabase Database Documentation](https://supabase.com/docs/guides/database)