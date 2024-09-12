import { createContext, useContext, useEffect, useState } from "react";
import { auth, db, storage } from "../firebase"; // Import Firestore and Storage
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendSignInLinkToEmail
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, uploadBytesResumable, ref } from "firebase/storage"; // For profile picture

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          // User data exists, load it
          setUserData(userDoc.data());
        } else {
          // If user data does not exist, create a new document for the user
          await setDoc(doc(db, "users", user.uid), {
            name: user.displayName || "",
            phone: "",
            role: "user", // Default role
            profilePic: ""
          });
          setUserData({
            name: user.displayName || "",
            phone: "",
            role: "user",
            profilePic: ""
          });
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Function to update profile data in Firestore
  const updateProfile = async (uid, data) => {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, data);
    setUserData((prev) => ({ ...prev, ...data }));
  };

  // Function to upload a profile picture to Firebase Storage and update the profile
  const uploadProfilePic = async (uid, file) => {
    const storageRef = ref(storage, `profilePics/${uid}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        () => {},
        (error) => reject(error),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          // Update user's Firestore document with the profile picture URL
          await updateProfile(uid, { profilePic: downloadURL });
          resolve(downloadURL);
        }
      );
    });
  };

  // Function to create a new profile (if necessary)
  const createProfile = async (uid, data) => {
    const userRef = doc(db, "users", uid);
    await setDoc(userRef, data);
    setUserData(data);
  };

  const value = {
    user,
    userData,
    setUserData,
    updateProfile,
    createProfile, // Added createProfile function
    uploadProfilePic,
    login: (email, password) => signInWithEmailAndPassword(auth, email, password),
    logout: () => signOut(auth),
    resetPassword: (email) => sendPasswordResetEmail(auth, email),
    sendEmailLink: (email) => {
      const actionCodeSettings = { url: "http://localhost:5173/complete-signup", handleCodeInApp: true };
      return sendSignInLinkToEmail(auth, email, actionCodeSettings);
    }
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
