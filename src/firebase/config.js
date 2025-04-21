// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
<<<<<<< HEAD
=======

// Debug environment variables
console.log("Firebase config:", {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET
});
>>>>>>> 791c2637effd681d7469648ed8f8bf2352d41d38

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDAaI7XfkL47cBj-7BnuK9fdrMywomutT4",
  authDomain: "whisper-web-gpu.firebaseapp.com",
  projectId: "whisper-web-gpu",
<<<<<<< HEAD
  storageBucket: "whisper-web-gpu.firebasestorage.app",
=======
  storageBucket: "whisper-web-gpu.appspot.com",
>>>>>>> 791c2637effd681d7469648ed8f8bf2352d41d38
  messagingSenderId: "1013187688074",
  appId: "1:1013187688074:web:6424cfd25cc9f2a2001f73",
  measurementId: "G-BBFGR0DYLX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

export { auth, db, storage, analytics };
export default app;
