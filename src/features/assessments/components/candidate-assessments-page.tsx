"use client";

import {
  ClipboardCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  useMyCandidateAssessments,
} from "../hooks";

import {
  CandidateAssessmentCard,
} from "./candidate-assessment-card";

import { useStartAttempt } from "@/features/attempts/hooks";

export function CandidateAssessmentsPage() {
  const router = useRouter();

  const assessmentsQuery =
    useMyCandidateAssessments();

  const startAttemptMutation =
    useStartAttempt();

  const handleStart = (attemptId: string) => {
    startAttemptMutation.mutate(attemptId, {
      onSuccess: (attempt) => {
        toast.success(
          "Assessment started successfully!",
        );

        router.push(
          `/assessments/${attempt.assessmentId}/attempt/${attempt.id}`,
        );
      },

      onError: (error) => {
        toast.error(
          error instanceof Error
            ? error.message
            : "Unable to start assessment.",
        );
      },
    });
  };

  if (assessmentsQuery.isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />

        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-36 animate-pulse rounded-xl bg-slate-100"
            />
          ))}
        </div>
      </div>
    );
  }

  if (assessmentsQuery.isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-900">
          Failed to load assessments
        </h2>

        <p className="mt-1 text-sm text-red-700">
          {assessmentsQuery.error instanceof Error
            ? assessmentsQuery.error.message
            : "Something went wrong."}
        </p>
      </div>
    );
  }

  const assessments =
    assessmentsQuery.data ?? [];

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <ClipboardCheck className="size-5" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              My Assessments
            </h1>

            <p className="text-sm text-slate-500">
              View and manage your assigned assessments.
            </p>
          </div>
        </div>
      </div>

      {assessments.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-white p-12 text-center">
          <ClipboardCheck className="mx-auto size-10 text-slate-400" />

          <h2 className="mt-4 text-lg font-semibold text-slate-900">
            No assessments yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            You don't have any accepted assessment
            invitations yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {assessments.map((assessment) => (
            <CandidateAssessmentCard
              key={assessment.attemptId}
              assessment={assessment}
              onStart={handleStart}
              isStarting={
                startAttemptMutation.isPending &&
                startAttemptMutation.variables ===
                  assessment.attemptId
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}