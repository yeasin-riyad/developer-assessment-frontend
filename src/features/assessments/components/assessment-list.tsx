"use client";

import { ClipboardList } from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  useAssessments,
  type Assessment,
} from "@/features/assessments";

import { AssessmentCard } from "./assessment-card";

export function AssessmentList() {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useAssessments();

  if (isLoading) {
    return <AssessmentListSkeleton />;
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-6">
        <h2 className="font-semibold text-destructive">
          Failed to load assessments
        </h2>

        <p className="mt-1 text-sm text-destructive/90">
          {error instanceof Error
            ? error.message
            : "Something went wrong while loading assessments."}
        </p>
      </div>
    );
  }

  const assessments = data?.data ?? [];

  if (assessments.length === 0) {
    return <EmptyAssessments />;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {assessments.map((assessment: Assessment) => (
        <AssessmentCard
          key={assessment.id}
          assessment={assessment}
        />
      ))}
    </div>
  );
}

function AssessmentListSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index}>
          <CardContent className="space-y-5 p-6">
            <div className="h-6 w-3/4 animate-pulse rounded-md bg-muted" />

            <div className="h-5 w-20 animate-pulse rounded-full bg-muted" />

            <div className="space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="h-16 animate-pulse rounded-lg bg-muted" />
              <div className="h-16 animate-pulse rounded-lg bg-muted" />
              <div className="h-16 animate-pulse rounded-lg bg-muted" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function EmptyAssessments() {
  return (
    <Card className="border-dashed">
      <CardContent className="flex min-h-80 flex-col items-center justify-center text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-muted">
          <ClipboardList className="size-7 text-muted-foreground" />
        </div>

        <h2 className="mt-5 text-lg font-semibold">
          No assessments yet
        </h2>

        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Create your first assessment and start building
          your problem set.
        </p>
      </CardContent>
    </Card>
  );
}