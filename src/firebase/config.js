// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, connectDatabaseEmulator } from "firebase/database";

// Debug environment variables
console.log("Firebase config:", {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET
});

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDAaI7XfkL47cBj-7BnuK9fdrMywomutT4",
  authDomain: "whisper-web-gpu.firebaseapp.com",
  projectId: "whisper-web-gpu",
  storageBucket: "whisper-web-gpu.appspot.com",
  messagingSenderId: "1013187688074",
  appId: "1:1013187688074:web:6424cfd25cc9f2a2001f73",
  measurementId: "G-BBFGR0DYLX",
  databaseURL: "https://whisper-web-gpu-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);
const database = getDatabase(app);

// Flag to track if we're using local storage mode
let usingLocalStorageMode = true; // Set to true by default

// Simple local storage database for offline development
const localDB = {
  users: {},
  transcripts: {}
};

// Load existing data from localStorage if available
try {
  const savedData = localStorage.getItem('localFirebaseDB');
  if (savedData) {
    Object.assign(localDB, JSON.parse(savedData));
  }
} catch (e) {
  console.error('Error loading local database:', e);
}

// Save localDB to localStorage
const saveLocalDB = () => {
  try {
    localStorage.setItem('localFirebaseDB', JSON.stringify(localDB));
  } catch (e) {
    console.error('Error saving local database:', e);
  }
};

// Connect to emulators in development mode
if (import.meta.env.DEV || import.meta.env.MODE === 'development') {
  try {
    // We'll skip this part since we know Firebase emulators aren't working
    // Just using local storage mode instead
    console.log("Using local storage mode for authentication as fallback");
  } catch (error) {
    console.warn("Could not connect to Firebase emulators:", error);
    console.log("Falling back to local storage mode for development");
  }
}

// Override Firebase auth methods
if (usingLocalStorageMode) {
  console.log("Using local storage mode for authentication");
  
  // Override signInWithEmailAndPassword
  auth.signInWithEmailAndPassword = async (email, password) => {
    console.log("Using local auth for sign in", email);
    
    // Check if user exists in local storage
    const user = Object.values(localDB.users).find(u => 
      u.email === email && u.password === password
    );
    
    if (!user) {
      throw { code: "auth/user-not-found", message: "User not found" };
    }
    
    // Store current user in localStorage
    localStorage.setItem('currentUser', JSON.stringify({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      subscription: user.subscription || 'free',
      usageMinutes: user.usageMinutes || 0
    }));
    
    // Simulate Firebase user credential
    return {
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      }
    };
  };
  
  // Override createUserWithEmailAndPassword
  auth.createUserWithEmailAndPassword = async (email, password) => {
    console.log("Using local auth for user creation", email);
    
    // Check if user already exists
    if (Object.values(localDB.users).some(u => u.email === email)) {
      throw { code: "auth/email-already-in-use", message: "Email already in use" };
    }
    
    // Create a new user
    const uid = 'local_' + Date.now();
    const newUser = {
      uid,
      email,
      password, // Note: In a real app, never store plain passwords
      displayName: email.split('@')[0],
      subscription: 'free',
      usageMinutes: 0,
      createdAt: new Date().toISOString()
    };
    
    // Save to localDB
    localDB.users[uid] = newUser;
    saveLocalDB();
    
    // Store current user in localStorage
    localStorage.setItem('currentUser', JSON.stringify({
      uid: newUser.uid,
      email: newUser.email,
      displayName: newUser.displayName,
      subscription: 'free',
      usageMinutes: 0
    }));
    
    // Simulate Firebase user credential
    return {
      user: {
        uid: newUser.uid,
        email: newUser.email,
        displayName: newUser.displayName,
        updateProfile: async (profileData) => {
          newUser.displayName = profileData.displayName;
          localDB.users[uid] = newUser;
          saveLocalDB();
          return Promise.resolve();
        }
      }
    };
  };
  
  // Override signOut
  auth.signOut = async () => {
    console.log("Using local auth for sign out");
    localStorage.removeItem('currentUser');
    return Promise.resolve();
  };
  
  // Set up auth state change handling
  const checkAuthState = () => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      // Notify any auth state listeners
      if (auth._onAuthStateChangedListeners) {
        auth._onAuthStateChangedListeners.forEach(callback => {
          callback(user);
        });
      }
    } else {
      // Notify listeners about signed out state
      if (auth._onAuthStateChangedListeners) {
        auth._onAuthStateChangedListeners.forEach(callback => {
          callback(null);
        });
      }
    }
  };
  
  // Initialize auth state listener array if not exists
  auth._onAuthStateChangedListeners = auth._onAuthStateChangedListeners || [];
  
  // Override onAuthStateChanged
  auth.onAuthStateChanged = (callback) => {
    console.log("Setting up local auth state listener");
    
    // Add callback to our listeners
    auth._onAuthStateChangedListeners.push(callback);
    
    // Check auth state immediately
    setTimeout(checkAuthState, 0);
    
    // Return an unsubscribe function
    return () => {
      const index = auth._onAuthStateChangedListeners.indexOf(callback);
      if (index > -1) {
        auth._onAuthStateChangedListeners.splice(index, 1);
      }
    };
  };
  
  // Initial auth state check
  checkAuthState();
}

export { auth, db, storage, analytics, database, usingLocalStorageMode, localDB, saveLocalDB };
export default app;
