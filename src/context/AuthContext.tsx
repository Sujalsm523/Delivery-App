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

  // const signUp = async (
  //   email: string,
  //   password: string,
  //   name: string,
  //   role: UserRole
  // ) => {
  //   setLoading(true);
  //   try {
  //     const userCredential = await createUserWithEmailAndPassword(
  //       auth,
  //       email,
  //       password
  //     );
  //     const newUser = userCredential.user;
  //     const userProfileData: UserProfile = {
  //       uid: newUser.uid,
  //       email: newUser.email || email,
  //       name,
  //       role,
  //       isVerified: false,
  //     };
  //     await setDoc(
  //       doc(
  //         db,
  //         `artifacts/${appId}/users/${newUser.uid}/userProfile`,
  //         "profile"
  //       ),
  //       userProfileData
  //     );
  //     setUserProfile(userProfileData);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // In src/context/AuthContext.tsx

  const signUp = async (
    email: string,
    password: string,
    name: string,
    role: UserRole
  ) => {
    // We wrap the entire process in a single try...catch block
    try {
      setLoading(true);
      console.log("--- Starting Sign-Up Process ---");

      // === Part 1: Firebase Authentication ===
      console.log("Step 1: Attempting to create user in Firebase Auth...");
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const newUser = userCredential.user;
      console.log(
        "Step 2: SUCCESS - User created in Auth with UID:",
        newUser.uid
      );

      // === Part 2: Firestore Database Write ===
      const userProfileData: UserProfile = {
        uid: newUser.uid,
        email: newUser.email || email,
        name,
        role,
        isVerified: false,
      };

      const profilePath = `artifacts/${appId}/users/${newUser.uid}/userProfile/profile`;
      console.log(
        `Step 3: Attempting to write profile data to Firestore at path: ${profilePath}`
      );
      console.log("Data to be written:", userProfileData);

      const profileDocRef = doc(db, profilePath);
      await setDoc(profileDocRef, userProfileData);

      console.log(
        "Step 4: SUCCESS - User profile document created in Firestore!"
      );

      // If successful, update the app's state
      setUserProfile(userProfileData);
    } catch (error) {
      // This block will execute if ANY of the "await" calls fail.
      console.error("--- SIGN-UP FAILED ---");
      console.error(
        "An error occurred during the sign-up process. Please see the details below."
      );

      // The error object from Firebase contains a 'code' and 'message' property
      // which are very helpful for debugging.
      console.error("Firebase Error Code:", (error as any).code);
      console.error("Firebase Error Message:", (error as any).message);

      alert(
        "Signup failed! Please check the developer console for the detailed error message."
      );

      // We still throw the error so the UI can handle it if needed
      throw error;
    } finally {
      console.log("--- Finished Sign-Up Process ---");
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
