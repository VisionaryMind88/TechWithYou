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
  ref, 
  uploadBytesResumable,
  getDownloadURL
} from "firebase/storage";

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

// Debug configuratie
console.log("Firebase Config:", { 
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "techwithyouu.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: "techwithyouu.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "161803725978",
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
});

// Firebase initialiseren met volledige configuratie
const app = initializeApp({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "techwithyouu.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: "techwithyouu.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "161803725978",
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
});
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

// Functies voor sociale login
export const signInWithGoogle = async (): Promise<UserCredential> => {
  try {
    // Eerst proberen met Popup (meest gebruikelijke manier)
    return await signInWithPopup(auth, googleProvider);
  } catch (error: any) {
    console.log("Popup failed, analyzing error...", error);
    
    // Check voor specifieke error: unauthorized domain
    if (error.code === 'auth/unauthorized-domain') {
      console.error("Firebase authentication domain error:", error);
      throw new Error(`
        De huidige domain is niet geautoriseerd in Firebase. 
        Voeg ${window.location.origin} toe aan de lijst van geautoriseerde domeinen in Firebase Console:
        1. Ga naar Firebase Console > Authentication > Settings > Authorized domains
        2. Voeg dit domein toe: ${window.location.origin}
      `);
    }
    
    // Als het een andere fout is, probeer redirect methode
    console.log("Attempting redirect authentication...");
    sessionStorage.setItem('authRedirectPath', window.location.pathname);
    // Redirect flow starten
    await signInWithRedirect(auth, googleProvider);
    // Deze code wordt nooit bereikt vanwege de redirect
    throw error;
  }
};

export const signInWithGithub = async (): Promise<UserCredential> => {
  try {
    // Eerst proberen met Popup (meest gebruikelijke manier)
    return await signInWithPopup(auth, githubProvider);
  } catch (error: any) {
    console.log("Popup failed, analyzing error...", error);
    
    // Check voor specifieke error: unauthorized domain
    if (error.code === 'auth/unauthorized-domain') {
      console.error("Firebase authentication domain error:", error);
      throw new Error(`
        De huidige domain is niet geautoriseerd in Firebase. 
        Voeg ${window.location.origin} toe aan de lijst van geautoriseerde domeinen in Firebase Console:
        1. Ga naar Firebase Console > Authentication > Settings > Authorized domains
        2. Voeg dit domein toe: ${window.location.origin}
      `);
    }
    
    // Als het een andere fout is, probeer redirect methode
    console.log("Attempting redirect authentication...");
    sessionStorage.setItem('authRedirectPath', window.location.pathname);
    // Redirect flow starten
    await signInWithRedirect(auth, githubProvider);
    // Deze code wordt nooit bereikt vanwege de redirect
    throw error;
  }
};

// Firebase auth logout
export const firebaseSignOut = async (): Promise<void> => {
  return signOut(auth);
};

// Maak de storage instantie aan
const storage = getStorage(app);

// Upload bestand naar Firebase Storage
export const uploadFileToStorage = async (file: File, path: string): Promise<string> => {
  try {
    // Referentie naar de locatie in Firebase Storage
    const storageRef = ref(storage, path);
    
    // Upload bestand met progress tracking
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    // Wacht tot upload is voltooid en krijg downloadURL
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Optioneel: track upload progress
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload progress: ' + progress + '%');
        },
        (error) => {
          // Handle errors
          console.error('Upload error:', error);
          reject(error);
        },
        async () => {
          // Upload successful, get download URL
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  } catch (error) {
    console.error('File upload error:', error);
    throw error;
  }
};

// Exporteer auth voor gebruik in andere componenten
export { auth, onAuthStateChanged, storage };
export type { FirebaseUser };