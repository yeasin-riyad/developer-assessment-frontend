"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { useAuth } from "@/providers/auth.provider";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  const {
    user,
    isLoading,
    isAuthenticated,
  } = useAuth();

  useEffect(() => {
    if (
      !isLoading &&
      !isAuthenticated
    ) {
      router.replace("/login");
    }
  }, [
    isLoading,
    isAuthenticated,
    router,
  ]);

  useEffect(() => {
  if (!isLoading && !isAuthenticated) {
    router.replace("/login");
  }
}, [isLoading, isAuthenticated, router]);

if (isLoading || !isAuthenticated || !user) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="size-6 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
    </div>
  );
}

  // if (isLoading) {
  //   return (
  //     <div className="flex min-h-screen items-center justify-center">
  //       <div className="text-center">
  //         <div className="mx-auto mb-3 size-6 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />

  //         <p className="text-sm text-muted-foreground">
  //           Checking your session...
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <DashboardShell>
      {children}
    </DashboardShell>
  );
}