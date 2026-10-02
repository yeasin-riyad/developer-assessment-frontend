"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

import { UserRole } from "@/features/auth";
import { useAuth } from "@/providers/auth.provider";

export function ProblemPageActions() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const canCreate =
    user.role === UserRole.CREATOR ||
    user.role === UserRole.ADMIN;

  if (!canCreate) {
    return null;
  }

  return (
    <Link
      href="/problems/create"
      className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Plus className="mr-2 size-4" />
      Create Problem
    </Link>
  );
}