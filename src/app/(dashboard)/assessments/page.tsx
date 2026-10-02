import { AssessmentList } from "@/features/assessments/components/assessment-list";
import { AssessmentPageActions } from "@/features/assessments/components/assessment-details/assessment-page-actions";

export default function AssessmentsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Assessments
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Create, manage, and publish your technical assessments.
          </p>
        </div>

        <AssessmentPageActions />
      </div>

      <AssessmentList />
    </div>
  );
}