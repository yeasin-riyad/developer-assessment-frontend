import { EditAssessmentForm } from "@/features/assessments/components/edit-assessment-form";

interface EditAssessmentPageProps {
  params: Promise<{
    assessmentId: string;
  }>;
}

export default async function EditAssessmentPage({
  params,
}: EditAssessmentPageProps) {
  const { assessmentId } = await params;

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Edit Assessment
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Update the assessment details.
        </p>
      </div>

      <EditAssessmentForm assessmentId={assessmentId} />
    </div>
  );
}