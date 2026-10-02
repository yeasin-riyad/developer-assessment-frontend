"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

import { UserRole } from "@/features/auth";
import { useAuth } from "@/providers/auth.provider";

export function AssessmentPageActions() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  if (user.role !== UserRole.RECRUITER) {
    return null;
  }

  return (
    <Link
      href="/assessments/create"
      className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Plus className="mr-2 size-4" />
      Create Assessment
    </Link>
  );
}