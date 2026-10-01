"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  loginUser,
  logoutUser,
  type AuthUser,
  type LoginPayload,
} from "@/features/auth";

import { useCurrentUser } from "@/features/users";

import {
  getAccessToken,
  removeAccessToken,
  setAccessToken,
} from "@/lib/auth";

interface AuthContextValue {
  user: AuthUser | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;

  login: (
    payload: LoginPayload,
  ) => Promise<void>;

  logout: () => Promise<void>;
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
  const [mounted, setMounted] =
    useState(false);

  const [hasToken, setHasToken] =
    useState(false);

  const currentUser = useCurrentUser(
    mounted && hasToken,
  );

  useEffect(() => {
  const syncAuthState = () => {
    setHasToken(
      Boolean(getAccessToken()),
    );
  };

  syncAuthState();

  setMounted(true);

  window.addEventListener(
    "auth:changed",
    syncAuthState,
  );

  return () => {
    window.removeEventListener(
      "auth:changed",
      syncAuthState,
    );
  };
}, []);

  const login = async (
    payload: LoginPayload,
  ) => {
    const response = await loginUser(payload);

    const accessToken =
      response.data.accessToken;

    if (!accessToken) {
      throw new Error(
        "Access token was not returned",
      );
    }

    setAccessToken(accessToken);

    // Important
    setHasToken(true);

    // Refetch current user
    await currentUser.refetch();
  };

  const logout = async () => {
  try {
    await logoutUser();
  } catch (error) {
    console.error(
      "Logout request failed:",
      error,
    );
  } finally {
    removeAccessToken();

    setHasToken(false);

    window.dispatchEvent(
      new Event("auth:changed"),
    );

    window.location.href = "/login";
  }
};

  const isLoading =
    !mounted ||
    (hasToken && currentUser.isLoading);

  const isAuthenticated =
    Boolean(currentUser.data?.data);

  const value: AuthContextValue = {
    user: currentUser.data?.data,
    isLoading,
    isAuthenticated,
    login,
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