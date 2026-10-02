"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { Skeleton } from "@/components/ui/skeleton";

import { useProblems } from "../hooks";

import { ProblemCard } from "./problem-card";

export function ProblemList() {
  const { data, isLoading, isError, error } = useProblems();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="space-y-4 rounded-xl border p-6">
            <Skeleton className="h-6 w-3/4" />

            <Skeleton className="h-4 w-1/2" />

            <Skeleton className="h-16 w-full" />

            <Skeleton className="h-9 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Failed to load problems</AlertTitle>

        <AlertDescription>
          {error instanceof Error
            ? error.message
            : "Something went wrong while loading problems."}
        </AlertDescription>
      </Alert>
    );
  }

  const problems = data?.data ?? [];

  if (problems.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-12 text-center">
        <h3 className="text-lg font-semibold">No problems found</h3>

        <p className="mt-2 text-sm text-muted-foreground">
          Create your first problem to get started.
        </p>

        <Button className="mt-5">
          <Link
            className="inline-flex h-9 items-center justify-center"
            href="/problems/create"
          >
            <Plus className="mr-2 size-4" />
            Create Problem
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {problems.map((problem) => (
        <ProblemCard key={problem.id} problem={problem} />
      ))}
    </div>
  );
}
