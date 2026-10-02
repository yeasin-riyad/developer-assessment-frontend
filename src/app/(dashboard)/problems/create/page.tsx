import { ProblemForm } from "@/features/problems";

export default function CreateProblemPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Create Problem
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Create a new problem for your assessment problem bank.
        </p>
      </div>

      <ProblemForm />
    </div>
  );
}