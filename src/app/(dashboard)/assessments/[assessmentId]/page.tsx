import { AssessmentDetails } from "@/features/assessments/components/assessment-details/assessment-details";

interface AssessmentDetailsPageProps {
  params: Promise<{
    assessmentId: string;
  }>;
}

export default async function AssessmentDetailsPage({
  params,
}: AssessmentDetailsPageProps) {
  const { assessmentId } = await params;

  return <AssessmentDetails assessmentId={assessmentId} />;
}