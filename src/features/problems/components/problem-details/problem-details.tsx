"use client";

import { useProblem } from "@/features/problems";

import { ProblemDetailsHeader } from "./problem-details-header";
import { ProblemDetailsContent } from "./problem-details-content";
import { ProblemDetailsSidebar } from "./problem-details-sidebar";

interface ProblemDetailsProps {
  problemId: string;
}

export function ProblemDetails({
  problemId,
}: ProblemDetailsProps) {
  const { data, isLoading, isError, error } =
    useProblem(problemId);

  if (isLoading) {
    return <ProblemDetailsSkeleton />;
  }

  if (isError || !data?.data) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-6">
        <h2 className="font-semibold text-destructive">
          Failed to load problem
        </h2>

        <p className="mt-1 text-sm text-destructive/90">
          {error instanceof Error
            ? error.message
            : "The problem could not be found."}
        </p>
      </div>
    );
  }

  const problem = data.data;

  return (
    <div className="space-y-6">
      <ProblemDetailsHeader problem={problem} />

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <ProblemDetailsContent problem={problem} />

        <ProblemDetailsSidebar problem={problem} />
      </div>
    </div>
  );
}

function ProblemDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-32 animate-pulse rounded-xl border bg-muted" />

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="h-96 animate-pulse rounded-xl border bg-muted" />

        <div className="h-64 animate-pulse rounded-xl border bg-muted" />
      </div>
    </div>
  );
}