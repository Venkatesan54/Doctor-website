import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup,
  sendPasswordResetEmail
} from "firebase/auth";
import { auth, db } from "./config";
import { doc, setDoc, getDoc } from "firebase/firestore";

// Register user
export const registerUser = async (email, password, userData) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  
  // Store user data in Firestore with role
  await setDoc(doc(db, "users", user.uid), {
    ...userData,
    uid: user.uid,
    createdAt: new Date().toISOString(),
  });
  
  return user;
};

// Login user
export const loginUser = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

// Google Sign-In
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  
  // Check if user already exists in Firestore
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    // Create a default user profile if it doesn't exist
    await setDoc(userRef, {
      name: user.displayName,
      email: user.email,
      role: "user", // Default role
      uid: user.uid,
      createdAt: new Date().toISOString(),
    });
  }
  
  return user;
};

// Logout
export const logoutUser = () => signOut(auth);

// Password Reset
export const resetPassword = (email) => sendPasswordResetEmail(auth, email);

// Get User Profile from Firestore
export const getUserProfile = async (uid) => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    return userSnap.data();
  }
  return null;
};
