"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, X } from "lucide-react";

import {
  dashboardNavigation,
} from "@/config/navigation";



import {
  Button,
} from "@/components/ui/button";

import {
  Separator,
} from "@/components/ui/separator";

import {
  cn,
} from "@/lib/utils";
import { useAuth } from "@/providers/auth.provider";

interface DashboardSidebarProps {
  onNavigate?: () => void;
}

export function DashboardSidebar({
  onNavigate,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  const {
    user,
    logout,
  } = useAuth();

  if (!user) {
    return null;
  }

  const navigationItems =
    dashboardNavigation.filter(
      (item) =>
        item.roles.includes(user.role),
    );

  const handleLogout = async () => {
    await logout();
  };

  return (
    <aside className="flex h-full w-64 flex-col border-r bg-background">
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-5">
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className="flex items-center gap-2"
        >
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-sm font-bold">
              DA
            </span>
          </div>

          <div>
            <p className="text-sm font-bold leading-none">
              DevAssess
            </p>

            <p className="mt-1 text-[10px] text-muted-foreground">
              Developer Platform
            </p>
          </div>
        </Link>

        {onNavigate && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onNavigate}
            className="md:hidden"
          >
            <X className="size-4" />
          </Button>
        )}
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            pathname === item.href ||
            pathname.startsWith(
              `${item.href}/`,
            );

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                "hover:bg-muted hover:text-foreground",
                isActive &&
                  "bg-primary/10 text-primary",
                !isActive &&
                  "text-muted-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" />

              <span>
                {item.title}
              </span>
            </Link>
          );
        })}
      </nav>

      <Separator />

      {/* User */}
      <div className="p-3">
        <div className="mb-2 rounded-lg bg-muted/50 p-3">
          <p className="truncate text-sm font-medium">
            {user.name}
          </p>

          <p className="truncate text-xs text-muted-foreground">
            {user.email}
          </p>

          <p className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            {user.role}
          </p>
        </div>

        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="size-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}