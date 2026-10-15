
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { useAuth } from "@/providers/auth.provider";
import { useMySubscription } from "@/features/billing";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  const {
    user,
    isLoading: isAuthLoading,
    isAuthenticated,
  } = useAuth();

  const isCandidate = user?.role === "CANDIDATE";

  const subscriptionQuery = useMySubscription(
    isAuthenticated && isCandidate,
  );

  // API response structure: { success, statusCode, message, data }
  const subscription = subscriptionQuery.data?.data ?? null;

  const remainingDays = subscription?.endDate
    ? Math.max(
        0,
        Math.ceil(
          (new Date(subscription.endDate).getTime() -
            Date.now()) /
            (1000 * 60 * 60 * 24),
        ),
      )
    : 0;

  const hasActivePaidPlan =
    subscription?.status === "ACTIVE" &&
    (subscription?.plan === "STARTER" ||
      subscription?.plan === "PRO") &&
    remainingDays > 0;

  const isSubscriptionLoading =
    isAuthenticated &&
    isCandidate &&
    subscriptionQuery.isPending;

  const isLoading = isAuthLoading || isSubscriptionLoading;

  useEffect(() => {
    if (isAuthLoading) return;

    if (!isAuthenticated || !user) {
      router.replace("/login");
      return;
    }

    // Other roles do not require a candidate subscription.
    if (user.role !== "CANDIDATE") return;

    // Wait until the subscription request finishes.
    if (subscriptionQuery.isPending) return;

    // Redirect candidates without a valid paid subscription.
    if (subscriptionQuery.isError || !hasActivePaidPlan) {
      router.replace("/billing");
    }
  }, [
    isAuthLoading,
    isAuthenticated,
    user,
    subscriptionQuery.isPending,
    subscriptionQuery.isError,
    hasActivePaidPlan,
    router,
  ]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-6 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  // Do not render protected dashboard content while redirecting.
  if (isCandidate && !hasActivePaidPlan) {
    return null;
  }

  return <DashboardShell>{children}</DashboardShell>;
}
