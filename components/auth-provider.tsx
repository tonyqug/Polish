"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";

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

const AuthContext = createContext<AuthContextType>({user: null, setUser: () => {}})
export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/user/get-user");
        if (res.ok) {
          const data: User = await res.json();
          setUser(data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    fetchUser();
  }, []);

  return (
    <SessionProvider>
      <AuthContext.Provider value={{ user, setUser }}>
        {children}
      </AuthContext.Provider>
    </SessionProvider>
  );
}