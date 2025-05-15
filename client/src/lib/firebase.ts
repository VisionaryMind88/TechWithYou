import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup, 
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
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Firebase initialiseren
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Auth providers instellen
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// Functies voor sociale login
export const signInWithGoogle = async (): Promise<UserCredential> => {
  return signInWithPopup(auth, googleProvider);
};

export const signInWithGithub = async (): Promise<UserCredential> => {
  return signInWithPopup(auth, githubProvider);
};

// Firebase auth logout
export const firebaseSignOut = async (): Promise<void> => {
  return signOut(auth);
};

// Exporteer auth voor gebruik in andere componenten
export { auth, onAuthStateChanged };
export type { FirebaseUser };