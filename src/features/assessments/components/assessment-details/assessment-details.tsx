"use client";

import { useAssessment } from "@/features/assessments/hooks";
import { AssessmentStats } from "./assessment-stats";
import { AssessmentHeader } from "./assessment-header";
import { AssessmentProblems } from "./assessment-problem";
import { AssessmentDetailsSkeleton } from "../AssessmentDetailsSkeleton";

interface AssessmentDetailsProps {
  assessmentId: string;
}

export function AssessmentDetails({
  assessmentId,
}: AssessmentDetailsProps) {
  const { data, isLoading, isError } = useAssessment(assessmentId);

  if (isLoading) {
    return <AssessmentDetailsSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="rounded-lg border p-6 text-center">
        Failed to load assessment.
      </div>
    );
  }

  const assessment = data.data ?? data;

  return (
    <div className="space-y-6">
      <AssessmentHeader assessment={assessment} />

      <AssessmentStats assessment={assessment} />

      <AssessmentProblems
        assessmentId={assessmentId}
        problems={assessment.problems ?? []}
        status={assessment.status}
      />
    </div>
  );
}