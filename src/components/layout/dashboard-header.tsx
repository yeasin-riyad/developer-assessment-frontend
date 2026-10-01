"use client";

import Link from "next/link";
import {
  Bell,
  Menu,
} from "lucide-react";

import {
  Button,
} from "@/components/ui/button";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

import {
  Separator,
} from "@/components/ui/separator";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/providers/auth.provider";



interface DashboardHeaderProps {
  onMenuClick: () => void;
}

export function DashboardHeader({
  onMenuClick,
}: DashboardHeaderProps) {
  const {
    user,
    logout,
  } = useAuth();

  if (!user) {
    return null;
  }

  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-6">
      {/* Mobile menu */}
      <Button
        variant="ghost"
        size="icon"
        className="mr-2 md:hidden"
        onClick={onMenuClick}
      >
        <Menu className="size-5" />
      </Button>

      {/* Page area */}
      <div className="flex-1">
        <p className="text-sm font-medium">
          Welcome back, {user.name.split(" ")[0]} 👋
        </p>

        <p className="hidden text-xs text-muted-foreground sm:block">
          Manage your developer assessment platform.
        </p>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="relative"
        >
          <Bell className="size-4" />

          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-destructive" />
        </Button>

        <Separator
          orientation="vertical"
          className="mx-1 hidden h-6 sm:block"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-10 gap-2 px-2"
            >
              <Avatar className="size-8">
                <AvatarFallback>
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="hidden text-left sm:block">
                <p className="max-w-32 truncate text-sm font-medium">
                  {user.name}
                </p>

                <p className="text-xs text-muted-foreground">
                  {user.role}
                </p>
              </div>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-56"
          >
            <DropdownMenuLabel>
              <div>
                <p className="font-medium">
                  {user.name}
                </p>

                <p className="text-xs font-normal text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link href="/profile">
                Profile
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href="/settings">
                Settings
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={logout}
              className="text-destructive focus:text-destructive"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}