# Firebase Configuration for Railway Deployment

This guide focuses specifically on configuring Firebase to work with your Railway deployment.

## 1. Update Firebase Authentication Settings

### Add Railway Domain to Authorized Domains

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project "techwithyouu"
3. Go to Authentication → Settings → Authorized domains
4. Add your Railway app domain (e.g., `your-app-name.railway.app`)
5. Save the changes

This is a crucial step that allows Firebase Authentication to work on your Railway domain.

## 2. Configure OAuth Providers

If you're using Google or GitHub authentication, you need to update their callback URLs:

### Google Authentication

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services → Credentials
3. Find and edit your OAuth 2.0 Client ID
4. Add the following to Authorized redirect URIs:
   - `https://your-app-name.railway.app/auth/google/callback`
5. Save the changes

### GitHub Authentication

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Select your OAuth App
3. Update the Authorization callback URL to include:
   - `https://your-app-name.railway.app/auth/github/callback`
4. Save the changes

## 3. Firebase Storage Rules

Ensure your Firebase Storage rules allow access from your Railway domain:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      // Allow read/write access based on authentication status
      allow read, write: if request.auth != null;
      
      // For public files you might want more permissive rules
      match /public/{document=**} {
        allow read: if true;
        allow write: if request.auth != null;
      }
    }
  }
}
```

## 4. Firebase Realtime Database Rules

If you're using Firebase Realtime Database, update its rules to work with your Railway deployment:

```
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null",
    
    "notifications": {
      "$userId": {
        ".read": "auth != null && auth.uid == $userId",
        ".write": "auth != null && auth.uid == $userId"
      }
    },
    
    "chats": {
      "$roomId": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    }
  }
}
```

## 5. Environment Variables for Firebase

Make sure these Firebase-related environment variables are set in Railway:

```
# Firebase Admin SDK
FIREBASE_API_KEY=<your-firebase-api-key>
FIREBASE_PROJECT_ID=techwithyouu
FIREBASE_AUTH_DOMAIN=techwithyouu.firebaseapp.com
FIREBASE_STORAGE_BUCKET=techwithyouu.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=161803725978
FIREBASE_APP_ID=1:161803725978:web:09518a312516edea2cc323
FIREBASE_MEASUREMENT_ID=G-CJ8T9FYM2V

# Frontend Firebase Config
VITE_FIREBASE_API_KEY=<your-firebase-api-key>
VITE_FIREBASE_AUTH_DOMAIN=techwithyouu.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=techwithyouu
VITE_FIREBASE_STORAGE_BUCKET=techwithyouu.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=161803725978
VITE_FIREBASE_APP_ID=1:161803725978:web:09518a312516edea2cc323
VITE_FIREBASE_MEASUREMENT_ID=G-CJ8T9FYM2V
```

## 6. Testing Firebase on Railway

After deploying to Railway, test these Firebase features:

1. **Authentication**:
   - Sign in with email/password
   - Sign in with Google
   - Sign in with GitHub
   - Verify that session persists across page reloads

2. **File uploads**:
   - Try uploading files to Firebase Storage
   - Verify that the files are properly stored and can be retrieved

3. **Real-time features**:
   - Test chat functionality
   - Verify notifications are working

## 7. Troubleshooting Common Firebase Issues

### Authentication Errors

- **"Unauthorized domain" errors**: Ensure your Railway domain is added to Firebase authorized domains
- **"Redirect URL mismatch"**: Verify OAuth callback URLs match exactly with your Railway domain
- **"Invalid API key"**: Check that FIREBASE_API_KEY and VITE_FIREBASE_API_KEY are correctly set

### Storage Errors

- **Permission denied**: Check Firebase Storage rules and ensure user is authenticated
- **CORS errors**: Verify your Firebase Storage settings allow access from your Railway domain

### Database Connection Issues

- **Connection refused**: Check your database connection string and make sure Railway IPs are allowed
- **Authentication errors**: Verify DATABASE_URL includes the correct username, password, and connection parameters

## 8. Security Best Practices

1. Use Firebase App Check to prevent abuse
2. Configure appropriate security rules for Firebase Storage and Realtime Database
3. Set up Firebase Authentication multi-factor authentication for increased security
4. Regularly rotate your Firebase API keys
5. Monitor Firebase Authentication activity for suspicious patterns
6. Use Firebase Security Rules to control access to your data