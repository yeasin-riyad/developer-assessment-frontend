"use client";

import {
  CheckCircle2,
  CircleX,
} from "lucide-react";

import type { ResultItem } from "../types";

interface ResultQuestionListProps {
  items: ResultItem[];
}

export function ResultQuestionList({
  items,
}: ResultQuestionListProps) {
  return (
    <div className="rounded-xl border bg-white shadow-sm">
      {/* Header */}
      <div className="border-b px-6 py-5">
        <h2 className="text-lg font-semibold text-slate-900">
          Question Breakdown
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Review your performance for each question.
        </p>
      </div>

      {/* Questions */}
      <div className="divide-y">
        {items.map((item, index) => {
          const isCorrect =
            item.obtainedMarks === item.maximumMarks;

          return (
            <div
              key={item.id}
              className="flex items-center gap-4 px-6 py-5"
            >
              {/* Status Icon */}
              <div className="shrink-0">
                {isCorrect ? (
                  <CheckCircle2 className="size-5 text-green-600" />
                ) : (
                  <CircleX className="size-5 text-red-500" />
                )}
              </div>

              {/* Question Information */}
              <div className="min-w-0 flex-1">
                <p className="font-medium text-slate-900">
                  {index + 1}. {item.problem.title}
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                    {item.problem.type}
                  </span>

                  <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                    {item.problem.difficulty}
                  </span>
                </div>
              </div>

              {/* Marks */}
              <div className="shrink-0 text-right">
                <p
                  className={`font-semibold ${
                    isCorrect
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {item.obtainedMarks} / {item.maximumMarks}
                </p>

                <p className="text-xs text-slate-500">
                  marks
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}