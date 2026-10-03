"use client";

import { MoreHorizontal, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AssessmentProblemCardProps {
  index: number;
  assessmentId: string;
  canEdit: boolean;
  problem: {
    id: string;
    title: string;
    type: "MCQ" | "WRITTEN";
    difficulty: "EASY" | "MEDIUM" | "HARD";
    points: number;
  };
}

export function AssessmentProblemCard({
  index,
  problem,
  canEdit,
}: AssessmentProblemCardProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium">
          {index + 1}
        </div>

        <div className="min-w-0">
          <p className="truncate font-medium">
            {problem.title}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge variant="outline">
              {problem.type}
            </Badge>

            <Badge variant="secondary">
              {problem.difficulty}
            </Badge>

            <span className="text-sm text-muted-foreground">
              {problem.points} marks
            </span>
          </div>
        </div>
      </div>

      {canEdit && (
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0"
        >
          <Trash2 className="size-4 text-destructive" />
        </Button>
      )}
    </div>
  );
}