"use client";

import type { ReactNode } from "react";
import QueryProvider from "./query-provider";


interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
      <QueryProvider>
        {children}
      </QueryProvider>
  );
}