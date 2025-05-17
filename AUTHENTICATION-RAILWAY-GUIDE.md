# Authentication Configuration Guide for Railway Deployment

This guide focuses specifically on setting up and troubleshooting authentication when deploying your application to Railway.

## Step 1: Configure OAuth Providers for Railway Domain

### Google Authentication

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services → Credentials
3. Edit your OAuth 2.0 Client ID
4. Add your Railway domain to the authorized JavaScript origins:
   - `https://your-app-name.railway.app`
5. Add the callback URL to authorized redirect URIs:
   - `https://your-app-name.railway.app/auth/google/callback`
6. Save the changes

### GitHub Authentication

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Select your OAuth application
3. Update the Homepage URL:
   - `https://your-app-name.railway.app`
4. Update the Authorization callback URL:
   - `https://your-app-name.railway.app/auth/github/callback`
5. Save the changes

## Step 2: Firebase Authentication Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your "techwithyouu" project
3. Navigate to Authentication → Settings → Authorized domains
4. Add your Railway domain:
   - `your-app-name.railway.app`
5. Save the changes

## Step 3: Update Environment Variables in Railway

Set the following environment variables in Railway dashboard:

```
# Firebase Configuration
FIREBASE_API_KEY=<your-firebase-api-key>
FIREBASE_PROJECT_ID=techwithyouu
FIREBASE_AUTH_DOMAIN=techwithyouu.firebaseapp.com

# For Frontend
VITE_FIREBASE_API_KEY=<your-firebase-api-key>
VITE_FIREBASE_AUTH_DOMAIN=techwithyouu.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=techwithyouu
```

## Step 4: Test Authentication Flows

After deploying to Railway, test all authentication methods:

1. Email/Password Registration
   - Register a new test user
   - Verify email verification process (if enabled)
   - Test login with the new credentials

2. Google Sign-in
   - Click the Google sign-in button
   - Go through the OAuth flow
   - Verify successful sign-in and redirect

3. GitHub Sign-in
   - Click the GitHub sign-in button
   - Go through the OAuth flow
   - Verify successful sign-in and redirect

## Step 5: Troubleshooting Common Authentication Issues

### "Unauthorized Domain" Errors

**Issue**: Firebase shows "This domain is not authorized"

**Solution**:
1. Add your exact Railway domain to Firebase authorized domains
2. Make sure your environment variables use the correct Firebase project
3. Check browser console for specific error messages

### OAuth Callback Failures

**Issue**: OAuth redirects to error page after authorization

**Solution**:
1. Verify callback URLs exactly match your Railway URL including the path
2. Check for HTTPS vs HTTP mismatches
3. Ensure the OAuth provider is correctly configured with your Railway domain

### Session Not Persisting

**Issue**: User is logged out after page refresh

**Solution**:
1. Check SESSION_SECRET is properly set in Railway
2. Verify session middleware is properly configured
3. Check for any CORS issues with cookies

### Cross-Origin Issues

**Issue**: Authentication requests blocked by CORS

**Solution**:
1. Ensure your server has proper CORS configuration for your Railway domain
2. Check any security headers that might be blocking cross-origin requests
3. Verify all API endpoints that handle authentication have proper CORS headers

## Step 6: Debugging Authentication

To debug authentication issues, add these temporary measures:

1. Add additional logging to authentication routes:

```typescript
// Add to server/routes.ts or auth.ts
app.post('/api/login', (req, res, next) => {
  console.log('Login attempt:', req.body.username);
  // ... existing code
});
```

2. Check Railway logs for authentication errors:
   - Railway Dashboard → Deployments → Select deployment → Logs
   - Filter logs for "auth", "login", or "authentication"

3. Test authentication endpoints directly:

```bash
curl -X POST https://your-app-name.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123"}'
```

## Step 7: Security Considerations

1. Always use HTTPS for your Railway deployment
2. Set a strong SESSION_SECRET in Railway environment variables
3. Consider adding rate limiting for authentication endpoints
4. Implement proper CSRF protection for login forms
5. Use HTTP-only cookies for authentication tokens