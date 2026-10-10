
"use client";

import {
  useAdminProblem,
} from "../../hooks/useAdmin";

import type {
  AdminProblem,
} from "../../types/admin.types";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Badge,
} from "@/components/ui/badge";

import {
  Button,
} from "@/components/ui/button";

import {
  Separator,
} from "@/components/ui/separator";

import {
  Skeleton,
} from "@/components/ui/skeleton";

import {
  AlertCircle,
  CheckCircle2,
  ClipboardList,
  FileText,
  UserRound,
} from "lucide-react";

interface AdminProblemDetailsDialogProps {
  problemId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatDate(value?: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">
        {label}
      </p>

      <div className="text-sm font-medium">
        {value}
      </div>
    </div>
  );
}

function ProblemDetailsContent({
  problem,
}: {
  problem: AdminProblem;
}) {
  const assessmentUsages =
    problem.assessmentProblems ?? [];

  const options = problem.options ?? [];
  const testCases = problem.testCases ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline">
          {problem.type}
        </Badge>

        <Badge
          variant={
            problem.difficulty === "EASY"
              ? "secondary"
              : problem.difficulty === "MEDIUM"
                ? "outline"
                : "destructive"
          }
        >
          {problem.difficulty}
        </Badge>

        <Badge variant="secondary">
          {problem.points} points
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 rounded-lg border p-4 sm:grid-cols-3">
        <InfoItem
          label="Options"
          value={problem._count.options ?? options.length}
        />

        <InfoItem
          label="Test cases"
          value={
            problem._count.testCases ?? testCases.length
          }
        />

        <InfoItem
          label="Assessment usage"
          value={
            problem._count.assessmentProblems ??
            assessmentUsages.length
          }
        />

        <InfoItem
          label="Submissions"
          value={problem._count.submissions ?? 0}
        />

        <InfoItem
          label="Candidate answers"
          value={problem._count.attemptAnswers ?? 0}
        />

        <InfoItem
          label="Result references"
          value={problem._count.resultItems ?? 0}
        />
      </div>

      <Separator />

      <section className="space-y-3">
        <h3 className="flex items-center gap-2 font-semibold">
          <FileText className="size-4" />
          Description
        </h3>

        <div className="whitespace-pre-wrap break-words rounded-lg bg-muted/50 p-4 text-sm leading-6">
          {problem.description || "No description provided."}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="flex items-center gap-2 font-semibold">
          <UserRound className="size-4" />
          Created by
        </h3>

        <div className="rounded-lg border p-4">
          <p className="font-medium">
            {problem.createdBy?.name ?? "Unknown"}
          </p>

          <p className="text-sm text-muted-foreground">
            {problem.createdBy?.email ?? "No email"}
          </p>

          {problem.createdBy?.role && (
            <Badge
              variant="outline"
              className="mt-2"
            >
              {problem.createdBy.role}
            </Badge>
          )}
        </div>
      </section>

      {problem.type === "MCQ" && (
        <section className="space-y-3">
          <h3 className="font-semibold">
            Answer options ({options.length})
          </h3>

          {options.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No options found.
            </p>
          ) : (
            <div className="space-y-2">
              {options.map((option, index) => (
                <div
                  key={option.id}
                  className="flex items-start gap-3 rounded-lg border p-3"
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                    {String.fromCharCode(65 + index)}
                  </span>

                  <p className="min-w-0 flex-1 break-words pt-1 text-sm">
                    {option.text}
                  </p>

                  {option.isCorrect ? (
                    <Badge className="shrink-0 gap-1">
                      <CheckCircle2 className="size-3" />
                      Correct
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="shrink-0"
                    >
                      Incorrect
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {testCases.length > 0 && (
        <section className="space-y-3">
          <h3 className="font-semibold">
            Test cases ({testCases.length})
          </h3>

          <div className="space-y-3">
            {testCases.map((testCase, index) => (
              <div
                key={testCase.id}
                className="space-y-3 rounded-lg border p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold">
                    Test case {index + 1}
                  </p>

                  <Badge
                    variant={
                      testCase.isHidden
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {testCase.isHidden
                      ? "Hidden"
                      : "Visible"}
                  </Badge>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="min-w-0 space-y-1">
                    <p className="text-xs text-muted-foreground">
                      Input
                    </p>

                    <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-md bg-muted p-3 text-xs">
                      {testCase.input}
                    </pre>
                  </div>

                  <div className="min-w-0 space-y-1">
                    <p className="text-xs text-muted-foreground">
                      Expected output
                    </p>

                    <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-md bg-muted p-3 text-xs">
                      {testCase.expectedOutput}
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-3">
        <h3 className="flex items-center gap-2 font-semibold">
          <ClipboardList className="size-4" />
          Assessment usage ({assessmentUsages.length})
        </h3>

        {assessmentUsages.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            This problem is not currently linked to any
            assessment.
          </p>
        ) : (
          <div className="space-y-2">
            {assessmentUsages.map((usage) => (
              <div
                key={usage.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3"
              >
                <div className="min-w-0">
                  <p className="break-words font-medium">
                    {usage.assessment.title}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Order: {usage.order}
                    {" · "}
                    {usage.points} points
                  </p>
                </div>

                <Badge variant="outline">
                  {usage.assessment.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </section>

      <Separator />

      <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
        <InfoItem
          label="Created at"
          value={formatDate(problem.createdAt)}
        />

        <InfoItem
          label="Last updated"
          value={formatDate(problem.updatedAt)}
        />
      </div>
    </div>
  );
}

export function AdminProblemDetailsDialog({
  problemId,
  open,
  onOpenChange,
}: AdminProblemDetailsDialogProps) {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useAdminProblem(problemId ?? "");

  const problem = data?.data;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            Problem details
          </DialogTitle>

          <DialogDescription>
            Review the problem, its options, test cases,
            and assessment usage.
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="space-y-4 py-4">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-36 w-full" />
          </div>
        )}

        {!isLoading && isError && (
          <div className="space-y-4 rounded-lg border border-destructive/30 p-5">
            <AlertCircle className="size-8 text-destructive" />

            <p className="text-sm text-muted-foreground">
              {error instanceof Error
                ? error.message
                : "Failed to load problem details."}
            </p>

            <Button
              variant="outline"
              onClick={() => void refetch()}
            >
              Try again
            </Button>
          </div>
        )}

        {!isLoading && !isError && problem && (
          <>
            <div className="space-y-1">
              <h2 className="break-words text-xl font-semibold">
                {problem.title}
              </h2>
            </div>

            <ProblemDetailsContent
              problem={problem}
            />
          </>
        )}

        {!isLoading && !isError && !problem && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Problem details are unavailable.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}