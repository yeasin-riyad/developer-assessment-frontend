"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

import { useAuth } from "@/providers/auth.provider";

import { UserRole } from "@/features/auth";
import { ProblemList } from "@/features/problems/components/problem-list";

export default function ProblemsPage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const canCreate =
    user.role === UserRole.CREATOR ||
    user.role === UserRole.ADMIN;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Problems
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Browse and manage your assessment problem bank.
          </p>
        </div>

        {canCreate && (
          <Link
            href="/problems/create"
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Plus className="mr-2 size-4" />
            Create Problem
          </Link>
        )}
      </div>

      <ProblemList />
    </div>
  );
}