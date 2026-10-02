import { ProblemPageActions } from "@/features/problems";
import { ProblemList } from "@/features/problems/components/problem-list";

export default function ProblemsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Problems
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Browse and manage your assessment problem bank.
          </p>
        </div>

        <ProblemPageActions />
      </div>

      <ProblemList />
    </div>
  );
}