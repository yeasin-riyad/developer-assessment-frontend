"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";

import { useCurrentUser } from "@/features/users";
import { removeAccessToken } from "@/lib/auth";

interface AuthContextValue {
  user: ReturnType<typeof useCurrentUser>["data"];
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext =
  createContext<AuthContextValue | undefined>(
    undefined,
  );

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const currentUser = useCurrentUser();

  const logout = () => {
    removeAccessToken();

    window.location.href = "/login";
  };

  const value: AuthContextValue = {
    user: currentUser.data?.data,
    isLoading: currentUser.isLoading,
    isAuthenticated: Boolean(currentUser.data?.data),
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider",
    );
  }

  return context;
}