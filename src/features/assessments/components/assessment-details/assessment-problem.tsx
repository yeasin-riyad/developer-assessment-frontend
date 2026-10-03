"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

import { AssessmentProblemCard } from "./assessment-problem-card";
import { AddProblemDialog } from "../add-problem-dialog";

interface AssessmentProblemsProps {
  assessmentId: string;
  problems: Array<{
    id: string;
    title: string;
    type: "MCQ" | "WRITTEN";
    difficulty: "EASY" | "MEDIUM" | "HARD";
    points: number;
  }>;
  status: string;
}

export function AssessmentProblems({
  assessmentId,
  problems,
  status,
}: AssessmentProblemsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            Assessment Problems
          </h2>

          <p className="text-sm text-muted-foreground">
            Manage the problems included in this assessment.
          </p>
        </div>

        {status === "DRAFT" && (
          <AddProblemDialog assessmentId={assessmentId}>
            <Button>
              <Plus className="mr-2 size-4" />
              Add Problem
            </Button>
          </AddProblemDialog>
        )}
      </CardHeader>

      <CardContent>
        {problems.length === 0 ? (
          <div className="rounded-lg border border-dashed p-10 text-center">
            <p className="font-medium">
              No problems added yet
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Add problems to build this assessment.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {problems.map((problem, index) => (
              <AssessmentProblemCard
                key={problem.id}
                index={index}
                problem={problem}
                assessmentId={assessmentId}
                canEdit={status === "DRAFT"}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}