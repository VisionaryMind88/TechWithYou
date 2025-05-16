import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider, 
  GithubAuthProvider, 
  UserCredential, 
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";
import { 
  getStorage, 
  ref as storageRef, 
  uploadBytesResumable,
  getDownloadURL
} from "firebase/storage";
import {
  getDatabase, 
  ref as databaseRef,
  set,
  push,
  onValue,
  serverTimestamp
} from "firebase/database";

// Firebase configuratie met omgevingsvariabelen
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "techwithyouu.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: "techwithyouu.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "161803725978",
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Log config for debugging but mask the API key
console.log("Firebase Config:", {
  ...firebaseConfig,
  apiKey: firebaseConfig.apiKey ? "********" : undefined
});

// Firebase initialiseren met de config
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Auth providers instellen
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// Set custom parameters for login providers
googleProvider.setCustomParameters({
  // Forcing account selection even when one is already signed in
  prompt: 'select_account'
});

// Add tenantId if needed
// googleProvider.setCustomParameters({
//   tenant: 'TENANT_ID'
// });

// Functies voor sociale login met verbeterde foutafhandeling
export const signInWithGoogle = async (): Promise<UserCredential> => {
  try {
    // Eerst proberen met Popup (meest gebruikelijke manier)
    return await signInWithPopup(auth, googleProvider);
  } catch (error: any) {
    console.log("Popup failed, analyzing error...", error);
    
    // Map Firebase error codes to user-friendly error messages
    const errorMap: Record<string, string> = {
      'auth/unauthorized-domain': `
        De huidige domain is niet geautoriseerd in Firebase. 
        Voeg ${window.location.origin} toe aan de lijst van geautoriseerde domeinen in Firebase Console.
      `,
      'auth/popup-closed-by-user': 'Login was interrupted because the popup window was closed.',
      'auth/cancelled-popup-request': 'The authentication request was cancelled.',
      'auth/popup-blocked': 'The authentication popup was blocked by the browser. Please enable popups for this site.',
      'auth/account-exists-with-different-credential': 'An account already exists with the same email address but different sign-in credentials.',
      'auth/network-request-failed': 'Network error. Please check your internet connection and try again.'
    };
    
    if (error.code in errorMap) {
      console.error(`Firebase authentication error (${error.code}):`, error);
      throw new Error(errorMap[error.code]);
    }
    
    // Als het een andere fout is, probeer redirect methode
    console.log("Attempting redirect authentication...");
    sessionStorage.setItem('authRedirectPath', window.location.pathname);
    // Redirect flow starten
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (redirectError) {
      console.error("Redirect authentication failed:", redirectError);
      throw redirectError;
    }
    // Deze code wordt normaal nooit bereikt vanwege de redirect
    throw error;
  }
};

export const signInWithGithub = async (): Promise<UserCredential> => {
  try {
    // Eerst proberen met Popup (meest gebruikelijke manier)
    return await signInWithPopup(auth, githubProvider);
  } catch (error: any) {
    console.log("Popup failed, analyzing error...", error);
    
    // Map Firebase error codes to user-friendly error messages
    const errorMap: Record<string, string> = {
      'auth/unauthorized-domain': `
        De huidige domain is niet geautoriseerd in Firebase. 
        Voeg ${window.location.origin} toe aan de lijst van geautoriseerde domeinen in Firebase Console.
      `,
      'auth/popup-closed-by-user': 'Login was interrupted because the popup window was closed.',
      'auth/cancelled-popup-request': 'The authentication request was cancelled.',
      'auth/popup-blocked': 'The authentication popup was blocked by the browser. Please enable popups for this site.',
      'auth/account-exists-with-different-credential': 'An account already exists with the same email address but different sign-in credentials.',
      'auth/network-request-failed': 'Network error. Please check your internet connection and try again.'
    };
    
    if (error.code in errorMap) {
      console.error(`Firebase authentication error (${error.code}):`, error);
      throw new Error(errorMap[error.code]);
    }
    
    // Als het een andere fout is, probeer redirect methode
    console.log("Attempting redirect authentication...");
    sessionStorage.setItem('authRedirectPath', window.location.pathname);
    // Redirect flow starten
    try {
      await signInWithRedirect(auth, githubProvider);
    } catch (redirectError) {
      console.error("GitHub redirect authentication failed:", redirectError);
      throw redirectError;
    }
    // Deze code wordt normaal nooit bereikt vanwege de redirect
    throw error;
  }
};

// Firebase auth logout
export const firebaseSignOut = async (): Promise<void> => {
  return signOut(auth);
};

// Maak de storage instantie aan
const storage = getStorage(app);

// Maak de realtime database instantie aan
const database = getDatabase(app);

// Upload bestand naar Firebase Storage with improved error handling
export const uploadFileToStorage = async (file: File, path: string): Promise<string> => {
  try {
    // Validate file size (max 10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File too large. Maximum size is 10MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.`);
    }
    
    // Validate file type (optional security check)
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/zip', 'text/plain', 'text/csv'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      console.warn(`File type ${file.type} may not be supported. Attempting upload anyway.`);
    }
    
    // Referentie naar de locatie in Firebase Storage
    const fileStorageRef = storageRef(storage, path);
    
    // Upload bestand met progress tracking
    const uploadTask = uploadBytesResumable(fileStorageRef, file);
    
    // Wacht tot upload is voltooid en krijg downloadURL
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Optioneel: track upload progress
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload progress: ' + progress + '%');
        },
        (error: any) => {
          // Enhanced error handling
          console.error('Upload error:', error);
          
          // Map Firebase storage error codes to user-friendly messages
          const errorMap: Record<string, string> = {
            'storage/unauthorized': 'You do not have permission to upload files.',
            'storage/canceled': 'The upload was canceled by the user.',
            'storage/unknown': 'An unknown error occurred during upload.',
            'storage/object-too-large': 'The file is too large.',
            'storage/quota-exceeded': 'Storage quota exceeded.',
            'storage/invalid-checksum': 'File upload failed due to network issues. Please try again.'
          };
          
          if (error.code && errorMap[error.code]) {
            reject(new Error(errorMap[error.code]));
          } else {
            reject(error);
          }
        },
        async () => {
          try {
            // Upload successful, get download URL
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (urlError) {
            console.error('Error getting download URL:', urlError);
            reject(new Error('Upload succeeded but could not retrieve download URL. Please try again.'));
          }
        }
      );
    });
  } catch (error) {
    console.error('File upload error:', error);
    throw error;
  }
};

// Upload een bestand voor een chatbericht met extra validatie
export const uploadChatAttachment = async (
  file: File, 
  roomId: string,
  userId: number | null
): Promise<{ url: string; type: string; name: string; size: number }> => {
  try {
    // Validate roomId (basic sanitization)
    if (!roomId || !/^[a-zA-Z0-9_-]+$/.test(roomId)) {
      throw new Error('Invalid room ID. Room ID must only contain letters, numbers, hyphens and underscores.');
    }
    
    // Sanitize file name to prevent path traversal and other issues
    const sanitizedFilename = file.name.replace(/[^\w\s.-]/g, '_');
    
    // Maak een unieke bestandsnaam met timestamp en originele naam
    const timestamp = Date.now();
    const fileName = `${timestamp}_${userId || 'anonymous'}_${sanitizedFilename}`;
    
    // Pad naar de opslag locatie in Firebase Storage
    const path = `chat_attachments/${roomId}/${fileName}`;
    
    // Upload het bestand with timeout protection
    const UPLOAD_TIMEOUT = 60000; // 60 seconds timeout
    
    let uploadTimedOut = false;
    const timeoutId = setTimeout(() => {
      uploadTimedOut = true;
      throw new Error('File upload timed out. Please try again with a smaller file or check your connection.');
    }, UPLOAD_TIMEOUT);
    
    try {
      // Upload het bestand
      const url = await uploadFileToStorage(file, path);
      
      // Clear timeout since upload succeeded
      clearTimeout(timeoutId);
      
      // Don't proceed if upload has already timed out
      if (uploadTimedOut) return Promise.reject(new Error('Upload timed out'));
      
      // Geef attachment details terug
      return {
        url,
        type: file.type,
        name: sanitizedFilename,
        size: file.size
      };
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    console.error('Chat attachment upload error:', error);
    // Rethrow with a more user-friendly message
    if (error instanceof Error) {
      throw new Error(`Failed to upload attachment: ${error.message}`);
    }
    throw new Error('Failed to upload attachment. Please try again.');
  }
};

// Chat functies voor Firebase Realtime Database
export interface ChatMessage {
  userId: number | null;
  username: string;
  message: string;
  timestamp: number;
  isAdmin?: boolean;
  clientId?: number;
  attachment?: {
    type: string;
    name: string;
    url: string;
    size: number;
  };
}

// Interface voor notificaties
export interface ChatNotification {
  id?: string;
  roomId: string;
  fromUsername: string;
  message: string;
  timestamp: number;
  read: boolean;
  isAdmin: boolean;
}

// Functie om een bericht te versturen naar de Firebase Realtime Database met verbeterde validatie
export const sendChatMessage = async (
  roomId: string, 
  message: ChatMessage, 
  notifyClientId?: number
): Promise<void> => {
  try {
    // Validate roomId
    if (!roomId || !/^[a-zA-Z0-9_-]+$/.test(roomId)) {
      throw new Error('Invalid room ID format');
    }
    
    // Validate message content (prevent empty or excessively large messages)
    if (message.message && message.message.length > 10000) {
      throw new Error('Message is too long (maximum 10,000 characters)');
    }
    
    // Basic sanitization of message content (optional, can be enhanced)
    const sanitizedMessage = {
      ...message,
      message: message.message 
        ? message.message.trim().substring(0, 10000)
        : message.message,
      username: message.username 
        ? message.username.trim().substring(0, 100) 
        : message.username
    };
    
    // Referentie naar de chatroom in de realtime database
    const chatRef = databaseRef(database, `chats/${roomId}/messages`);
    
    // Nieuw bericht toevoegen aan de chatroom
    const newMessageRef = push(chatRef);
    
    // Bericht met timestamp opslaan
    await set(newMessageRef, {
      ...sanitizedMessage,
      timestamp: serverTimestamp()
    });
    
    // Als dit een admin bericht is, stuur een notificatie naar de client
    if (message.isAdmin && notifyClientId) {
      try {
        await sendChatNotification(notifyClientId, {
          roomId,
          fromUsername: sanitizedMessage.username,
          message: sanitizedMessage.message || 'Heeft een bestand gedeeld',
          timestamp: Date.now(),
          read: false,
          isAdmin: true
        });
      } catch (notificationError) {
        // Log notification error but don't fail the message send operation
        console.warn('Failed to send notification, but message was sent:', notificationError);
      }
    }
    
    console.log('Message sent successfully');
  } catch (error) {
    console.error('Error sending message:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to send message: ${error.message}`);
    }
    throw new Error('Failed to send message. Please try again.');
  }
};

// Functie om een chat notificatie te versturen met verbeterde validatie
export const sendChatNotification = async (
  userId: number,
  notification: ChatNotification
): Promise<void> => {
  try {
    // Validate user ID 
    if (typeof userId !== 'number' || userId <= 0) {
      throw new Error('Invalid user ID');
    }
    
    // Validate notification data and sanitize
    if (!notification.roomId || !notification.fromUsername) {
      throw new Error('Invalid notification data: missing required fields');
    }
    
    // Trim and limit message length for safety
    const sanitizedNotification = {
      ...notification,
      roomId: notification.roomId.trim().substring(0, 100),
      fromUsername: notification.fromUsername.trim().substring(0, 100),
      message: notification.message 
        ? notification.message.trim().substring(0, 500) // Limit message length
        : 'New notification',
      timestamp: notification.timestamp || Date.now(),
      read: !!notification.read, // Ensure boolean
      isAdmin: !!notification.isAdmin // Ensure boolean
    };
    
    // Referentie naar de notificaties van de gebruiker
    const notificationRef = databaseRef(database, `notifications/${userId}`);
    
    // Nieuwe notificatie toevoegen
    const newNotificationRef = push(notificationRef);
    
    // Notificatie opslaan
    await set(newNotificationRef, sanitizedNotification);
    
    // Set a maximum number of notifications per user (prevent storage overflow)
    // This could be moved to a cloud function for better performance in a production app
    try {
      const limitNotifications = async () => {
        // Get all notifications for this user
        const allNotificationsRef = databaseRef(database, `notifications/${userId}`);
        
        onValue(allNotificationsRef, (snapshot) => {
          const MAX_NOTIFICATIONS = 100;
          
          if (snapshot.size > MAX_NOTIFICATIONS) {
            // This is just an example - in a real app this would be better handled in a cloud function
            console.log(`User ${userId} has more than ${MAX_NOTIFICATIONS} notifications, consider a cleanup strategy`);
          }
        }, { onlyOnce: true });
      };
      
      // Run this check but don't await it (don't block notification sending)
      limitNotifications().catch(e => console.warn('Failed to check notification count:', e));
    } catch (limitCheckError) {
      // Just log the error but don't prevent notification from being sent
      console.warn('Failed to check notification limits:', limitCheckError);
    }
    
    console.log('Notification sent successfully');
  } catch (error) {
    console.error('Error sending notification:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to send notification: ${error.message}`);
    }
    throw new Error('Failed to send notification. Please try again.');
  }
};

// Functie om berichten uit een chatroom op te halen en realtime updates te ontvangen
export const subscribeToChatMessages = (
  roomId: string, 
  callback: (messages: ChatMessage[]) => void
) => {
  // Referentie naar de chatroom
  const chatRef = databaseRef(database, `chats/${roomId}/messages`);
  
  // Luisteren naar veranderingen in de chatroom
  const unsubscribe = onValue(chatRef, (snapshot) => {
    const messages: ChatMessage[] = [];
    
    // Itereren door alle berichten in de snapshot
    snapshot.forEach((childSnapshot) => {
      // Bericht toevoegen aan de array
      messages.push({
        ...childSnapshot.val(),
        id: childSnapshot.key
      });
    });
    
    // Sorteren op timestamp (oudste eerst)
    messages.sort((a, b) => a.timestamp - b.timestamp);
    
    // Callback aanroepen met de berichten
    callback(messages);
  });
  
  // Functie teruggeven om de subscription op te heffen
  return unsubscribe;
};

// Functie om notificaties op te halen voor een gebruiker
export const subscribeToNotifications = (
  userId: number,
  callback: (notifications: ChatNotification[]) => void
) => {
  // Referentie naar de notificaties
  const notificationsRef = databaseRef(database, `notifications/${userId}`);
  
  // Luisteren naar veranderingen in de notificaties
  const unsubscribe = onValue(notificationsRef, (snapshot) => {
    const notifications: ChatNotification[] = [];
    
    // Itereren door alle notificaties in de snapshot
    snapshot.forEach((childSnapshot) => {
      // Notificatie toevoegen aan de array
      notifications.push({
        ...childSnapshot.val(),
        id: childSnapshot.key
      });
    });
    
    // Sorteren op timestamp (nieuwste eerst)
    notifications.sort((a, b) => b.timestamp - a.timestamp);
    
    // Callback aanroepen met de notificaties
    callback(notifications);
  });
  
  // Functie teruggeven om de subscription op te heffen
  return unsubscribe;
};

// Functie om een notificatie als gelezen te markeren
export const markNotificationAsRead = async (userId: number, notificationId: string): Promise<void> => {
  try {
    // Referentie naar de notificatie
    const notificationRef = databaseRef(database, `notifications/${userId}/${notificationId}/read`);
    
    // Update alleen het 'read' veld naar true
    await set(notificationRef, true);
    
    console.log('Notification marked as read');
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

// Exporteer auth voor gebruik in andere componenten
export { auth, onAuthStateChanged, storage, database };
export type { FirebaseUser };