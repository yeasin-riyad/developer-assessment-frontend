import { AssessmentForm } from "@/features/assessments/components/assessment-form";

export default function CreateAssessmentPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Create Assessment
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Create a new assessment for your candidates.
        </p>
      </div>

      <AssessmentForm />
    </div>
  );
}