"use client";

import { useMemo, useState } from "react";

import { Loader2, Search } from "lucide-react";

import { useAddProblemToAssessment } from "../hooks";

import { useProblems } from "@/features/problems/hooks";

import type { Problem } from "@/features/problems/types";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

interface AddProblemDialogProps {
  assessmentId: string;
  children: React.ReactNode;
}

export function AddProblemDialog({
  assessmentId,
  children,
}: AddProblemDialogProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);

  const addProblemMutation = useAddProblemToAssessment();

  const { data, isLoading, isError } = useProblems({
    search: search || undefined,
    limit: 20,
  });

  const problems = useMemo(() => data?.data ?? [], [data]);


function handleAddProblem() {
  if (!selectedProblem) {
    return;
  }

  addProblemMutation.mutate(
    {
      assessmentId,
      payload: {
        problemId: selectedProblem.id,
        points: selectedProblem.points,
        order:1
      },
    },
    {
      onSuccess: () => {
        toast.success("Problem added successfully!", {
          duration: 1000,
        });
      },

      onError: (error) => {
        toast.error("Unable to add problem", {
          description:
            error instanceof Error
              ? error.message
              : "We couldn't add this problem to the assessment. Please try again.",
          duration: 2000,
        });
      },
    },
  );
}



  function handleOpenChange(value: boolean) {
    setOpen(value);

    if (!value) {
      setSelectedProblem(null);
      setSearch("");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Problem</DialogTitle>

          <DialogDescription>
            Select a problem from your problem bank to add it to this
            assessment.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search problems..."
              className="pl-9"
            />
          </div>

          {/* Problem List */}
          <div className="max-h-80 space-y-2 overflow-y-auto">
            {isLoading && (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="size-5 animate-spin" />
              </div>
            )}

            {isError && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-center text-sm text-destructive">
                Failed to load problems.
              </div>
            )}

            {!isLoading && !isError && problems.length === 0 && (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <p className="font-medium">No problems found</p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Try a different search term.
                </p>
              </div>
            )}

            {problems.map((problem) => (
              <ProblemSelectItem
                key={problem.id}
                problem={problem}
                selected={selectedProblem?.id === problem.id}
                onSelect={() => setSelectedProblem(problem)}
              />
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>

          <Button
            type="button"
            disabled={!selectedProblem || addProblemMutation.isPending}
            onClick={handleAddProblem}
          >
            {addProblemMutation.isPending && (
              <Loader2 className="mr-2 size-4 animate-spin" />
            )}

            {addProblemMutation.isPending ? "Adding..." : "Add Problem"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface ProblemSelectItemProps {
  problem: Problem;
  selected: boolean;
  onSelect: () => void;
}

function ProblemSelectItem({
  problem,
  selected,
  onSelect,
}: ProblemSelectItemProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-lg border p-4 text-left transition-colors ${
        selected ? "border-primary bg-primary/5" : "hover:bg-muted/50"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-medium">{problem.title}</p>

          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className="rounded-md bg-muted px-2 py-1">
              {problem.type}
            </span>

            <span className="rounded-md bg-muted px-2 py-1">
              {problem.difficulty}
            </span>

            <span className="rounded-md bg-muted px-2 py-1">
              {problem.points} points
            </span>
          </div>
        </div>

        {selected && (
          <div className="shrink-0 text-sm font-medium text-primary">
            Selected
          </div>
        )}
      </div>
    </button>
  );
}
