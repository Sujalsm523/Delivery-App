// src/context/AuthContext.tsx
import React, {
  createContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type User,
  signInAnonymously,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, appId } from "../firebase/config";
import type { UserProfile, UserRole, AuthContextType } from "../types";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDocRef = doc(
          db,
          `artifacts/${appId}/users/${currentUser.uid}/userProfile`,
          "profile"
        );
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserProfile(userDocSnap.data() as UserProfile);
        } else {
          if (!currentUser.isAnonymous) {
            console.warn(
              "User profile not found for authenticated user:",
              currentUser.uid
            );
          }
          setUserProfile(null);
        }
      } else {
        // If no user, try to sign in anonymously for guest access
        try {
          await signInAnonymously(auth);
        } catch (error) {
          console.error("Anonymous sign in failed", error);
        }
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string,
    password: string,
    name: string,
    role: UserRole
  ) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const newUser = userCredential.user;
      const userProfileData: UserProfile = {
        uid: newUser.uid,
        email: newUser.email || email,
        name,
        role,
        isVerified: false,
      };
      await setDoc(
        doc(
          db,
          `artifacts/${appId}/users/${newUser.uid}/userProfile`,
          "profile"
        ),
        userProfileData
      );
      setUserProfile(userProfileData);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      // State will be cleared by onAuthStateChanged listener
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut: handleSignOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
