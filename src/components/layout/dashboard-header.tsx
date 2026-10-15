
"use client";

import {
  CalendarClock,
  ShieldCheck,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/providers/auth.provider";
import { useMySubscription } from "@/features/billing";

export function DashboardHeader() {
  const { user } = useAuth();

  const isCandidate = user?.role === "CANDIDATE";

  const subscriptionQuery = useMySubscription(
    Boolean(user && isCandidate),
  );

  const subscription = subscriptionQuery.data?.data;

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

  const hasActiveSubscription =
    subscription?.status === "ACTIVE" &&
    (subscription?.plan === "STARTER" ||
      subscription?.plan === "PRO") &&
    remainingDays > 0;

  if (!user) {
    return null;
  }

  const initials = user.name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between gap-4 border-b border-slate-200/80 bg-white/90 px-4 py-3 backdrop-blur-xl md:px-6">
      {/* Welcome message */}
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-sm font-semibold text-slate-900 sm:text-base">
          Welcome back, {user.name.trim().split(/\s+/)[0]} 👋
        </h1>

        <p className="mt-1 hidden text-xs text-slate-500 sm:block">
          Manage your developer assessment platform.
        </p>
      </div>

      {/* Subscription remaining days */}
      {isCandidate && (
        <div
          className={`hidden shrink-0 items-center gap-2 rounded-xl border px-3 py-2 sm:flex ${
            hasActiveSubscription
              ? remainingDays <= 5
                ? "border-amber-200 bg-amber-50 text-amber-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-slate-200 bg-slate-50 text-slate-600"
          }`}
        >
          <CalendarClock className="size-4 shrink-0" />

          <div className="leading-tight">
            <p className="text-xs font-medium">
              {subscriptionQuery.isPending
                ? "Subscription"
                : hasActiveSubscription
                  ? "Subscription remaining"
                  : "No active plan"}
            </p>

            <p className="text-sm font-bold">
              {subscriptionQuery.isPending
                ? "Loading..."
                : hasActiveSubscription
                  ? `${remainingDays} ${
                      remainingDays === 1 ? "day" : "days"
                    } left`
                  : "Expired"}
            </p>
          </div>
        </div>
      )}

      {/* User information — no dropdown or buttons */}
      <div className="flex min-w-0 shrink-0 items-center gap-2.5 border-l border-slate-200 pl-3 sm:pl-4">
        <Avatar className="size-9 shrink-0 border border-indigo-100">
          <AvatarFallback className="bg-indigo-50 text-sm font-semibold text-indigo-700">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="hidden size-3.5 shrink-0 text-indigo-600 sm:block" />

            <p className="max-w-28 truncate text-xs font-semibold text-slate-800 sm:max-w-40 sm:text-sm">
              {user.role}
            </p>
          </div>

          <p
            title={user.email}
            className="max-w-28 truncate text-[11px] text-slate-500 sm:max-w-48 sm:text-xs"
          >
            {user.email}
          </p>
        </div>
      </div>
    </header>
  );
}
