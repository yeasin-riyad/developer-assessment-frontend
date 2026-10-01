"use client";

import type { ReactNode } from "react";

import { AuthProvider } from "./auth.provider";
import QueryProvider from "./query-provider";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({
  children,
}: AppProvidersProps) {
  return (
    <QueryProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryProvider>
  );
}