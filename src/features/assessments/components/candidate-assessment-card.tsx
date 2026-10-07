"use client";

import { Clock3, FileText, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { CandidateAssessment } from "../types";

interface CandidateAssessmentCardProps {
  assessment: CandidateAssessment;
  onStart: (attemptId: string) => void;
  isStarting?: boolean;
}

export function CandidateAssessmentCard({
  assessment,
  onStart,
  isStarting = false,
}: CandidateAssessmentCardProps) {
  const router = useRouter();

  const {
    attemptId,
    assessment: assessmentInfo,
    status,
    answeredQuestions,
  } = assessment;

  const handleAction = () => {
    if (status === "NOT_STARTED") {
      onStart(attemptId);
      return;
    }

    if (status === "IN_PROGRESS") {
      router.push(
        `/assessments/${assessmentInfo.id}/attempt/${attemptId}`,
      );
      return;
    }

    if (status === "SUBMITTED") {
      router.push(
        `/assessments/attempts/${attemptId}/result`
        // `/assessments/${assessmentInfo.id}/result/${attemptId}`,
      );
    }
  };

  const statusConfig = {
    NOT_STARTED: {
      label: "Not Started",
      className:
        "bg-amber-50 text-amber-700 border-amber-200",
      action: "Start Assessment",
    },

    IN_PROGRESS: {
      label: "In Progress",
      className:
        "bg-blue-50 text-blue-700 border-blue-200",
      action: "Continue Assessment",
    },

    SUBMITTED: {
      label: "Submitted",
      className:
        "bg-green-50 text-green-700 border-green-200",
      action: "View Result",
    },

    EXPIRED: {
      label: "Expired",
      className:
        "bg-red-50 text-red-700 border-red-200",
      action: "View Result",
    },
  } as const;

  const config = statusConfig[status];

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {assessmentInfo.title}
              </h2>

              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Clock3 className="size-4" />
                  {assessmentInfo.duration} minutes
                </span>

                <span className="flex items-center gap-1.5">
                  <Trophy className="size-4" />
                  {assessmentInfo.totalMarks} marks
                </span>

                {status === "IN_PROGRESS" && (
                  <span className="flex items-center gap-1.5">
                    <FileText className="size-4" />
                    {answeredQuestions} answered
                  </span>
                )}
              </div>
            </div>

            <span
              className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${config.className}`}
            >
              {config.label}
            </span>
          </div>

          <Button
            onClick={handleAction}
            disabled={
              isStarting ||
              status === "EXPIRED"
            }
          >
            {isStarting
              ? "Starting..."
              : config.action}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}