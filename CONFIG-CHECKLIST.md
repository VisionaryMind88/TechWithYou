# Railway Deployment Checklist

## Required Configuration 

### 1. Port Configuration
Make sure your application listens on the correct port:
- In `server/index.ts`, ensure the app listens on `process.env.PORT || 5000` 
- Set `PORT=5000` in Railway environment variables
- Ensure all bindings use `0.0.0.0` instead of `localhost`

### 2. Environment Variables
Set these variables in the Railway dashboard:
- `DATABASE_URL` - Your Supabase PostgreSQL connection string
- `FIREBASE_API_KEY` - Your Firebase API key
- `FIREBASE_PROJECT_ID` - techwithyouu
- `FIREBASE_AUTH_DOMAIN` - techwithyouu.firebaseapp.com
- `FIREBASE_STORAGE_BUCKET` - techwithyouu.firebasestorage.app
- `FIREBASE_MESSAGING_SENDER_ID` - 161803725978
- `FIREBASE_APP_ID` - 1:161803725978:web:09518a312516edea2cc323
- `FIREBASE_MEASUREMENT_ID` - G-CJ8T9FYM2V
- `SESSION_SECRET` - A strong random string
- And all VITE_ prefixed variables for the frontend

### 3. Build and Start Commands
- Build Command: `npm run build`
- Start Command: `npm run start`

### 4. Authentication Setup
- Configure OAuth providers (Google, GitHub) with correct Railway callback URLs
- Add Railway domain to Firebase authorized domains list
- Update Security Rules in Firebase to allow access from Railway

## Deployment Steps

1. Connect your GitHub repository to Railway
2. Configure all environment variables  
3. Deploy the application
4. Verify the application is running with health check at `/api/health`
5. Test all features (authentication, database operations, file uploads)

## Common Issues and Solutions

- **CORS errors**: Add Railway domain to allowed origins
- **Database connection failures**: Check IP allowlist in Supabase
- **Authentication errors**: Verify OAuth callback URLs and authorized domains
- **Build failures**: Check for missing dependencies or environment variables

## Testing After Deployment

- Login functionality (both local and OAuth)
- File uploads to Firebase Storage
- Database operations (create, read, update, delete)
- Real-time features and notifications
- Test on mobile and desktop devices