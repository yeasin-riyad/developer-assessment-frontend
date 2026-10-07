"use client";

import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileCheck2,
  Loader2,
  RefreshCw,
} from "lucide-react";

import { useMyResult } from "../hooks";
import { ResultSummary } from "./result-summary";
import { ResultQuestionList } from "./result-question-list";

interface CandidateResultPageProps {
  attemptId: string;
}

export function CandidateResultPage({
  attemptId,
}: CandidateResultPageProps) {
  const {
    data: result,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useMyResult(attemptId);

  /*
   * Result is not generated yet.
   *
   * Backend returns 404 when the result does not exist.
   * This can happen when:
   * - Candidate submitted the assessment
   * - MCQ/WRITTEN evaluation is still pending
   * - Result generation has not happened yet
   */
  const isResultPending =
    isError && getStatusCode(error) === 404;

  if (isLoading) {
    return <ResultPageSkeleton />;
  }

  if (isResultPending) {
    return (
      <ResultPendingState
        onRefresh={() => refetch()}
        isRefreshing={isFetching}
      />
    );
  }

  if (isError || !result) {
    return (
      <ResultErrorState
        onRetry={() => refetch()}
        isRetrying={isFetching}
      />
    );
  }

  const { assessment, submittedAt, startedAt } = result.attempt;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/assessments/my"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
        >
          <ArrowLeft className="size-4" />
          Back to Assessments
        </Link>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <FileCheck2 className="size-6 text-indigo-600" />

              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Assessment Result
              </h1>
            </div>

            <p className="mt-1 text-slate-500">
              {assessment.title}
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700">
            <CheckCircle2 className="size-4" />
            Result Available
          </div>
        </div>
      </div>

      {/* Result Summary */}
      <ResultSummary result={result} />

      {/* Assessment Information */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Assessment Summary
          </h2>

          {assessment.description && (
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {assessment.description}
            </p>
          )}
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          {/* Started */}
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
              <CalendarDays className="size-5 text-slate-500" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Started
              </p>

              <p className="mt-1 text-sm font-medium text-slate-900">
                {formatDate(startedAt)}
              </p>
            </div>
          </div>

          {/* Submitted */}
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
              <CheckCircle2 className="size-5 text-slate-500" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Submitted
              </p>

              <p className="mt-1 text-sm font-medium text-slate-900">
                {submittedAt
                  ? formatDate(submittedAt)
                  : "Not available"}
              </p>
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
              <Clock3 className="size-5 text-slate-500" />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Duration
              </p>

              <p className="mt-1 text-sm font-medium text-slate-900">
                {assessment.duration} minutes
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Question Breakdown */}
      <ResultQuestionList items={result.items} />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Result Pending State                                                       */
/* -------------------------------------------------------------------------- */

interface ResultPendingStateProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

function ResultPendingState({
  onRefresh,
  isRefreshing,
}: ResultPendingStateProps) {
  return (
    <div className="mx-auto max-w-3xl py-8">
      <div className="overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm">
        {/* Top accent */}
        <div className="h-1.5 bg-amber-400" />

        <div className="p-8 text-center sm:p-10">
          {/* Icon */}
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-amber-100">
            <Clock3 className="size-8 text-amber-600" />
          </div>

          {/* Title */}
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">
            Assessment Result is Pending
          </h1>

          {/* Description */}
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
            Your assessment has been submitted successfully. Your result
            is currently being evaluated and will be available once the
            evaluation process is completed.
          </p>

          {/* Status */}
          <div className="mx-auto mt-6 flex max-w-md items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-left">
            <Clock3 className="mt-0.5 size-5 shrink-0 text-amber-600" />

            <div>
              <p className="text-sm font-semibold text-amber-900">
                Evaluation in progress
              </p>

              <p className="mt-1 text-xs leading-5 text-amber-800">
                If your assessment contains written questions, an evaluator
                may need to review your answers before your final score can
                be generated.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isRefreshing ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <RefreshCw className="size-4" />
              )}

              {isRefreshing
                ? "Checking..."
                : "Check Result Again"}
            </button>

            <Link
              href="/assessments/my"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              <ArrowLeft className="size-4" />
              Back to Assessments
            </Link>
          </div>

          {/* Note */}
          <p className="mt-6 text-xs text-slate-400">
            Your submission has been recorded successfully. You can return
            here later to view your result.
          </p>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Error State                                                                */
/* -------------------------------------------------------------------------- */

interface ResultErrorStateProps {
  onRetry: () => void;
  isRetrying: boolean;
}

function ResultErrorState({
  onRetry,
  isRetrying,
}: ResultErrorStateProps) {
  return (
    <div className="mx-auto max-w-2xl py-8">
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-red-100">
          <AlertCircle className="size-7 text-red-600" />
        </div>

        <h2 className="mt-5 text-xl font-semibold text-red-900">
          Unable to Load Result
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-red-700">
          We could not load your assessment result right now. Please try
          again. If the problem continues, please contact the administrator.
        </p>

        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onRetry}
            disabled={isRetrying}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isRetrying ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <RefreshCw className="size-4" />
            )}

            {isRetrying ? "Retrying..." : "Try Again"}
          </button>

          <Link
            href="/assessments/my"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-100"
          >
            <ArrowLeft className="size-4" />
            Back to Assessments
          </Link>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Loading State                                                               */
/* -------------------------------------------------------------------------- */

function ResultPageSkeleton() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="space-y-3">
        <div className="h-5 w-36 animate-pulse rounded bg-slate-200" />

        <div className="h-8 w-56 animate-pulse rounded bg-slate-200" />

        <div className="h-5 w-72 animate-pulse rounded bg-slate-200" />
      </div>

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-xl bg-slate-200"
          />
        ))}
      </div>

      {/* Assessment Summary */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="h-6 w-48 animate-pulse rounded bg-slate-200" />

        <div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-slate-200" />

        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-12 animate-pulse rounded-lg bg-slate-100"
            />
          ))}
        </div>
      </div>

      {/* Questions */}
      <div className="h-80 animate-pulse rounded-xl bg-slate-200" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                     */
/* -------------------------------------------------------------------------- */

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function getStatusCode(error: unknown): number | undefined {
  if (!error || typeof error !== "object") {
    return undefined;
  }

  const possibleError = error as {
    statusCode?: number;
    status?: number;
    response?: {
      status?: number;
    };
  };

  return (
    possibleError.statusCode ??
    possibleError.status ??
    possibleError.response?.status
  );
}