"use client";
import {
  Loader2,
  Trash2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRemoveProblemFromAssessment } from "../../hooks";
import { useState } from "react";


interface AssessmentProblemCardProps {
  index: number;
  assessmentId: string;
  canEdit: boolean;

  problem: {
    id: string;
    assessmentId: string;
    problemId: string;
    order: number;
    points: number;
    createdAt: string;
    problem: {
      id: string;
      title: string;
      description: string;
      type: "MCQ" | "WRITTEN";
      difficulty: "EASY" | "MEDIUM" | "HARD";
    };
  };
}

export function AssessmentProblemCard({
  index,
  assessmentId,
  canEdit,
  problem,
}: AssessmentProblemCardProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] =
    useState(false);

  const removeProblemMutation =
    useRemoveProblemFromAssessment();

  function handleDelete() {
    removeProblemMutation.mutate(
      {
        assessmentId,
        problemId: problem.problemId,
      },
      {
        onSuccess: () => {
          setDeleteDialogOpen(false);
        },
      },
    );
  }

  return (
    <>
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium">
            {index + 1}
          </div>

          <div className="min-w-0">
            <p className="truncate font-medium">
              {problem.problem.title}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant="outline">
                {problem.problem.type}
              </Badge>

              <Badge variant="secondary">
                {problem.problem.difficulty}
              </Badge>

              <span className="text-sm text-muted-foreground">
                {problem.points} marks
              </span>
            </div>
          </div>
        </div>

        {canEdit && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={() => setDeleteDialogOpen(true)}
            disabled={removeProblemMutation.isPending}
          >
            {removeProblemMutation.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Trash2 className="size-4 text-destructive" />
            )}
          </Button>
        )}
      </div>

      <Dialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Remove Problem?
            </DialogTitle>

            <DialogDescription>
              Are you sure you want to remove{" "}
              <span className="font-medium text-foreground">
                "{problem.problem.title}"
              </span>{" "}
              from this assessment?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setDeleteDialogOpen(false)
              }
              disabled={removeProblemMutation.isPending}
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={removeProblemMutation.isPending}
            >
              {removeProblemMutation.isPending && (
                <Loader2 className="mr-2 size-4 animate-spin" />
              )}

              Remove Problem
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}