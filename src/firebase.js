// Import the Firebase SDK components you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

import { getDatabase, ref, set } from 'firebase/database';
import { getStorage } from "firebase/storage"; // Firebase Storage
import {
  getAuth,
  sendSignInLinkToEmail,
  createUserWithEmailAndPassword,
  updatePassword,
  signInWithEmailLink,
  isSignInWithEmailLink,
  sendPasswordResetEmail,
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBsv8hCcK0du9ZV-jgxq7kcFuFHWG1zK7U",

  authDomain: "kbc-23a3e.firebaseapp.com",

  databaseURL: "https://kbc-23a3e-default-rtdb.asia-southeast1.firebasedatabase.app",

  projectId: "kbc-23a3e",

  storageBucket: "kbc-23a3e.appspot.com",

  messagingSenderId: "64201199162",

  appId: "1:64201199162:web:c600724747e7bde0622f03",

  measurementId: "G-RYX8KV77H9"

};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app); // Firebase Authentication
const db = getFirestore(app); // Firestore Database
const db1 = getDatabase(app);
const storage = getStorage(app); // Firebase Storage
const analytics = getAnalytics(app); // Firebase Analytics (optional)

// Exporting Firebase functionalities for usage in the app
export {
  auth,
  db, // Firestore instance for database operations
  db1,
  storage, // Firebase Storage instance for file uploads
  sendSignInLinkToEmail,
  createUserWithEmailAndPassword,
  updatePassword,
  signInWithEmailLink,
  isSignInWithEmailLink,
  sendPasswordResetEmail
};
