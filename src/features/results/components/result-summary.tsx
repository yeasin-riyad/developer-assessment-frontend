"use client";

import {
  Award,
  CheckCircle2,
  CircleX,
  Target,
} from "lucide-react";

import type { CandidateResult } from "../types";

interface ResultSummaryProps {
  result: CandidateResult;
}

export function ResultSummary({
  result,
}: ResultSummaryProps) {
  const isPassed = result.status === "PASS";

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Score */}
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div className="rounded-lg bg-indigo-50 p-2">
            <Target className="size-5 text-indigo-600" />
          </div>
        </div>

        <p className="text-sm text-slate-500">
          Score
        </p>

        <p className="mt-1 text-2xl font-bold text-slate-900">
          {result.obtainedMarks}
          <span className="text-base font-medium text-slate-400">
            {" "}
            / {result.totalMarks}
          </span>
        </p>
      </div>

      {/* Percentage */}
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div className="rounded-lg bg-blue-50 p-2">
            <Award className="size-5 text-blue-600" />
          </div>
        </div>

        <p className="text-sm text-slate-500">
          Percentage
        </p>

        <p className="mt-1 text-2xl font-bold text-slate-900">
          {result.percentage}%
        </p>
      </div>

      {/* Status */}
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <div
            className={`rounded-lg p-2 ${
              isPassed
                ? "bg-green-50"
                : "bg-red-50"
            }`}
          >
            {isPassed ? (
              <CheckCircle2 className="size-5 text-green-600" />
            ) : (
              <CircleX className="size-5 text-red-600" />
            )}
          </div>
        </div>

        <p className="text-sm text-slate-500">
          Result
        </p>

        <p
          className={`mt-1 text-2xl font-bold ${
            isPassed
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {isPassed ? "Passed" : "Failed"}
        </p>
      </div>
    </div>
  );
}