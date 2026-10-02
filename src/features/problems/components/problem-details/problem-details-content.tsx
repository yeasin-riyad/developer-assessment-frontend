import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { Problem } from "@/features/problems";

import { ProblemDetailsOptions } from "./problem-details-options";

interface ProblemDetailsContentProps {
  problem: Problem;
}

export function ProblemDetailsContent({
  problem,
}: ProblemDetailsContentProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Question</CardTitle>

          <CardDescription>
            Problem description
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="whitespace-pre-wrap text-sm leading-7 text-foreground">
            {problem.description}
          </div>
        </CardContent>
      </Card>

      {problem.type === "MCQ" &&
        problem.options?.length > 0 && (
          <ProblemDetailsOptions
            options={problem.options}
          />
        )}
    </div>
  );
}