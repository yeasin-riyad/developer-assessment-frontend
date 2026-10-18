
"use client";

import {
  CalendarClock,
  ChevronDown,
  CreditCard,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAuth } from "@/providers/auth.provider";
import { useMySubscription } from "@/features/billing";
import { dashboardNavigation } from "@/config/navigation";

export function DashboardHeader() {
  const router = useRouter();
  const { user, logout } = useAuth();

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

  if (!user) return null;

  const initials = user.name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const firstName = user.name.trim().split(/\s+/)[0];

  const navigationItems = dashboardNavigation.filter((item) =>
    item.roles.includes(user.role),
  );

  const handleNavigate = (href: string) => {
    router.push(href);
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex min-h-16 items-center justify-between gap-3 border-b border-slate-200/80 bg-white/90 px-3 py-3 backdrop-blur-xl sm:px-4 md:px-6">
      {/* Welcome message */}
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-sm font-semibold text-slate-900 sm:text-base">
          Welcome back, {firstName} 👋
        </h1>

        <p className="mt-1 hidden text-xs text-slate-500 sm:block">
          Manage your developer assessment platform.
        </p>
      </div>

      {/* Desktop subscription */}
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

      {/* Mobile account menu */}
      <div className="sm:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                className="h-11 max-w-52 justify-start gap-2 rounded-xl border-slate-200 px-2.5"
                aria-label="Open account menu"
              />
            }
          >
            <Avatar className="size-8 shrink-0 border border-indigo-100">
              <AvatarFallback className="bg-indigo-50 text-xs font-semibold text-indigo-700">
                {initials}
              </AvatarFallback>
            </Avatar>

            <span className="min-w-0 flex-1 text-left">
              <span className="block truncate text-xs font-semibold text-slate-800">
                {firstName}
              </span>
              <span className="block truncate text-[10px] text-slate-500">
                {user.role}
              </span>
            </span>

            <ChevronDown className="size-4 shrink-0 text-slate-500" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            sideOffset={8}
            className="w-72 rounded-xl border-slate-200 p-2 shadow-xl"
          >
            {/* User information: plain div avoids Base UI group errors */}
            <div className="px-3 py-3">
              <div className="flex items-center gap-3">
                <Avatar className="size-10 shrink-0 border border-indigo-100">
                  <AvatarFallback className="bg-indigo-50 font-semibold text-indigo-700">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {user.name}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {user.email}
                  </p>
                  <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-indigo-600">
                    {user.role}
                  </p>
                </div>
              </div>
            </div>

            <DropdownMenuSeparator />

            {/* Candidate subscription */}
            {isCandidate && (
              <>
                <div className="mx-1 my-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center gap-2">
                    <CalendarClock className="size-4 text-indigo-600" />
                    <span className="text-xs font-medium text-slate-600">
                      Subscription
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {subscriptionQuery.isPending
                      ? "Loading subscription..."
                      : hasActiveSubscription
                        ? `${subscription?.plan} · ${remainingDays} ${
                            remainingDays === 1 ? "day" : "days"
                          } left`
                        : "No active paid plan"}
                  </p>

                  {!subscriptionQuery.isPending &&
                    hasActiveSubscription &&
                    remainingDays <= 5 && (
                      <p className="mt-1 text-xs text-amber-700">
                        Your plan is expiring soon.
                      </p>
                    )}
                </div>

                <DropdownMenuItem
                  onClick={() => handleNavigate("/billing")}
                  className="cursor-pointer rounded-lg"
                >
                  <CreditCard className="size-4" />
                  Manage subscription
                </DropdownMenuItem>

                <DropdownMenuSeparator />
              </>
            )}

            {/* Role-based navigation */}
            {navigationItems.map((item) => {
              const Icon = item.icon;

              return (
                <DropdownMenuItem
                  key={`${item.title}-${item.href}`}
                  onClick={() => handleNavigate(item.href)}
                  className="cursor-pointer rounded-lg"
                >
                  <Icon className="size-4" />
                  {item.title}
                </DropdownMenuItem>
              );
            })}

            <DropdownMenuSeparator />

            {/* Logout */}
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer rounded-lg text-red-600 focus:text-red-600"
            >
              <LogOut className="size-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Desktop user information */}
      <div className="hidden min-w-0 shrink-0 items-center gap-2.5 border-l border-slate-200 pl-3 sm:flex sm:pl-4">
        <Avatar className="size-9 shrink-0 border border-indigo-100">
          <AvatarFallback className="bg-indigo-50 text-sm font-semibold text-indigo-700">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="hidden size-3.5 shrink-0 text-indigo-600 md:block" />

            <p className="max-w-40 truncate text-xs font-semibold text-slate-800 sm:text-sm">
              {user.role}
            </p>
          </div>

          <p
            title={user.email}
            className="max-w-48 truncate text-xs text-slate-500"
          >
            {user.email}
          </p>
        </div>
      </div>
    </header>
  );
}
