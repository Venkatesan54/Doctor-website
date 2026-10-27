/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../lib/firebase/config";
import { doc, onSnapshot, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeProfile = null;
    let isMounted = true; // ✅ prevent state update after unmount

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (!isMounted) return;

      setCurrentUser(user);

      // Cleanup previous listener
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }

      if (user) {
        const userDocRef = doc(db, "users", user.uid);

        // ⏱ fallback timeout
        const timeoutId = setTimeout(() => {
          if (isMounted) setLoading(false);
        }, 4000);

        unsubscribeProfile = onSnapshot(
          userDocRef,
          async (snap) => {
            clearTimeout(timeoutId);

            if (!isMounted) return;

            if (snap.exists()) {
              setUserProfile({ id: snap.id, ...snap.data() });
            } else {
              // 🔁 fallback: check doctor collection
              try {
                const docRef = doc(db, "doctors", user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                  setUserProfile({ id: docSnap.id, ...docSnap.data() });
                } else {
                  setUserProfile(null);
                }
              } catch (err) {
                console.error("Doctor profile fetch error:", err);
                setUserProfile(null);
              }
            }

            setLoading(false);
          },
          (err) => {
            console.error("Firestore listener error:", err);
            clearTimeout(timeoutId);

            if (isMounted) {
              setUserProfile(null);
              setLoading(false);
            }
          }
        );
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    logout,
    isUser: userProfile?.role === "user",
    isDoctor: userProfile?.role === "doctor",
    isAdmin: userProfile?.role === "admin",
  };

  // ✅ Loading Screen
  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-blue-50">
        <div className="relative w-24 h-24 mb-6">
          <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-ping" />
          <div className="absolute inset-2 border-4 border-blue-400 rounded-full animate-pulse" />
          <div className="absolute inset-4 border-4 border-blue-600 rounded-full" />
        </div>
        <h2 className="text-xl font-bold text-blue-700 animate-pulse">
          Initializing Medical Platform...
        </h2>
        <p className="text-slate-500 mt-2">
          Checking clinical environment
        </p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};