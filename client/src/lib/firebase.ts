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
  } catch (error) {
    console.log("Popup failed, trying redirect...", error);
    // Als Popup mislukt, probeer met redirect
    // We moeten hier de browser URL opslaan, want we worden omgeleid
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
  } catch (error) {
    console.log("Popup failed, trying redirect...", error);
    // Als Popup mislukt, probeer met redirect
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

// Exporteer auth voor gebruik in andere componenten
export { auth, onAuthStateChanged };
export type { FirebaseUser };