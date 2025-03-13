"use client";


import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { auth } from "../lib/firebase"; // Import Firebase auth (frontend)
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";

interface User {
  email?: string;
  firstName?: string;
  lastName?: string;
  school?: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType>({ user: null, setUser: () => {} });

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Make sure the Firebase auth instance is initialized and ready
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      console.log("Auth state changed:", firebaseUser);

      if (firebaseUser) {
        // If a user is logged in, get the token
        const token = await firebaseUser.getIdToken();

        try {
          const res = await fetch("/api/user/get-user", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!res.ok) {
            console.error("Failed to fetch user data", res.status);
            return;
          }

          const userData = await res.json();
          console.log("User data fetched:", userData);
          setUser(userData); // Update the state with the fetched user data
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        // If no user is logged in, reset the user state
        console.log("No user logged in");
        setUser(null);
      }
    });

    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, []); // Empty dependency array means this effect runs only once (when the component mounts)

  return (
    
      <AuthContext.Provider value={{ user, setUser }}>
        {children}
      </AuthContext.Provider>
  
  );
}
