
"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Eye,
  FileText,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";

import {
  useAdminProblems,
  useDeleteAdminProblem,
} from "../hooks/useAdmin";

import type {
  AdminProblem,
  Difficulty,
  ProblemType,
} from "../types/admin.types";

import {
  AdminProblemDetailsDialog,
} from "../components/problems/AdminProblemDetailsDialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ALL = "ALL";

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(date);
}

function getErrorMessage(error: unknown) {
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

function DifficultyBadge({
  difficulty,
}: {
  difficulty: Difficulty;
}) {
  const variant =
    difficulty === "EASY"
      ? "secondary"
      : difficulty === "HARD"
        ? "destructive"
        : "outline";

  return (
    <Badge variant={variant}>
      {difficulty}
    </Badge>
  );
}

function ProblemTypeBadge({
  type,
}: {
  type: ProblemType;
}) {
  return (
    <Badge variant="outline">
      {type === "MCQ" ? "Multiple choice" : "Written"}
    </Badge>
  );
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: number;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-4 p-5">
        <div className="min-w-0 space-y-1">
          <p className="text-sm text-muted-foreground">
            {title}
          </p>

          <p className="text-2xl font-bold tracking-tight">
            {value.toLocaleString()}
          </p>

          <p className="text-xs text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  );
}

function ProblemsTableSkeleton() {
  return (
    <div className="space-y-3 p-5">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-14 animate-pulse rounded-lg bg-muted"
        />
      ))}
    </div>
  );
}

export function AdminProblemsPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState(ALL);
  const [difficulty, setDifficulty] = useState(ALL);

  const [selectedProblemId, setSelectedProblemId] =
    useState<string | null>(null);

  const [problemToDelete, setProblemToDelete] =
    useState<AdminProblem | null>(null);

  const filters = useMemo(
    () => ({
      search: search.trim() || undefined,
      type:
        type === ALL
          ? ""
          : (type as ProblemType),
      difficulty:
        difficulty === ALL
          ? ""
          : (difficulty as Difficulty),
    }),
    [search, type, difficulty],
  );

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useAdminProblems(filters);

  const deleteProblem = useDeleteAdminProblem();

  const problems = data?.data ?? [];

  const statistics = useMemo(() => {
    return {
      total: problems.length,
      mcq: problems.filter(
        (problem) => problem.type === "MCQ",
      ).length,
      written: problems.filter(
        (problem) => problem.type === "WRITTEN",
      ).length,
      used: problems.filter(
        (problem) =>
          (problem._count?.assessmentProblems ?? 0) > 0,
      ).length,
    };
  }, [problems]);

  function clearFilters() {
    setSearch("");
    setType(ALL);
    setDifficulty(ALL);
  }

  function handleDelete() {
    if (!problemToDelete) return;

    const problemId = problemToDelete.id;
    const problemTitle = problemToDelete.title;

    deleteProblem.mutate(problemId, {
      onSuccess: () => {
        toast.success(
          `"${problemTitle}" deleted successfully.`,
        );

        setProblemToDelete(null);

        if (selectedProblemId === problemId) {
          setSelectedProblemId(null);
        }
      },

      onError: (error) => {
        toast.error("Unable to delete problem", {
          description: getErrorMessage(error),
          duration: 6000,
        });

        setProblemToDelete(null);
      },
    });
  }

  return (
    <div className="mx-auto w-full max-w-screen-2xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Page heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <BookOpen className="size-5" />
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Manage Problems
            </h1>
          </div>

          <p className="text-sm text-muted-foreground">
            Review problem content, inspect usage, and
            manage platform questions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            onClick={() => void refetch()}
            disabled={isFetching}
          >
            <RefreshCw
              className={`mr-2 size-4 ${
                isFetching ? "animate-spin" : ""
              }`}
            />
            Refresh
          </Button>

          <Button
            onClick={() => {
              window.location.assign("/problems");
            }}
          >
            <Plus className="mr-2 size-4" />
            Create Problem
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Filtered Problems"
          value={statistics.total}
          description="Matching current filters"
          icon={FileText}
        />

        <StatCard
          title="MCQ Problems"
          value={statistics.mcq}
          description="Multiple-choice questions"
          icon={CheckCircle2}
        />

        <StatCard
          title="Written Problems"
          value={statistics.written}
          description="Written-answer questions"
          icon={BookOpen}
        />

        <StatCard
          title="Used in Assessments"
          value={statistics.used}
          description="Problems linked to assessments"
          icon={Users}
        />
      </div>

      {/* Filters and table */}
      <Card>
        <CardHeader className="space-y-4">
          <div>
            <CardTitle>All Problems</CardTitle>

            <CardDescription className="mt-1">
              Search and filter problems by type and
              difficulty.
            </CardDescription>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(220px,1fr)_190px_190px_auto]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search title or description..."
                className="pl-9 pr-9"
              />

              {search && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            <Select
              value={type}
              onValueChange={(value) =>
                setType(value ?? ALL)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Problem type" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value={ALL}>
                  All types
                </SelectItem>

                <SelectItem value="MCQ">
                  Multiple choice
                </SelectItem>

                <SelectItem value="WRITTEN">
                  Written
                </SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={difficulty}
              onValueChange={(value) =>
                setDifficulty(value ?? ALL)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value={ALL}>
                  All difficulties
                </SelectItem>

                <SelectItem value="EASY">
                  Easy
                </SelectItem>

                <SelectItem value="MEDIUM">
                  Medium
                </SelectItem>

                <SelectItem value="HARD">
                  Hard
                </SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={clearFilters}
              disabled={
                !search &&
                type === ALL &&
                difficulty === ALL
              }
            >
              Clear filters
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <ProblemsTableSkeleton />
          ) : isError ? (
            <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle className="size-6 text-destructive" />
              </div>

              <h3 className="font-semibold">
                Failed to load problems
              </h3>

              <p className="max-w-md text-sm text-muted-foreground">
                {getErrorMessage(error)}
              </p>

              <Button
                variant="outline"
                onClick={() => void refetch()}
              >
                <RefreshCw className="mr-2 size-4" />
                Try again
              </Button>
            </div>
          ) : problems.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
                <Search className="size-6 text-muted-foreground" />
              </div>

              <h3 className="font-semibold">
                No problems found
              </h3>

              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                Try changing your search or filters to
                find the problems you need.
              </p>

              <Button
                variant="outline"
                className="mt-4"
                onClick={clearFilters}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[260px]">
                        Problem
                      </TableHead>

                      <TableHead>Type</TableHead>

                      <TableHead>Difficulty</TableHead>

                      <TableHead>Points</TableHead>

                      <TableHead>Usage</TableHead>

                      <TableHead>Creator</TableHead>

                      <TableHead>Created</TableHead>

                      <TableHead className="text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {problems.map((problem) => (
                      <TableRow key={problem.id}>
                        <TableCell>
                          <div className="max-w-[320px] space-y-1">
                            <p className="font-medium">
                              {problem.title}
                            </p>

                            <p className="line-clamp-2 text-xs text-muted-foreground">
                              {problem.description}
                            </p>
                          </div>
                        </TableCell>

                        <TableCell>
                          <ProblemTypeBadge
                            type={problem.type}
                          />
                        </TableCell>

                        <TableCell>
                          <DifficultyBadge
                            difficulty={problem.difficulty}
                          />
                        </TableCell>

                        <TableCell>
                          <span className="font-semibold">
                            {problem.points}
                          </span>
                        </TableCell>

                        <TableCell>
                          <div className="space-y-1 text-xs">
                            <p>
                              Assessments:{" "}
                              {problem._count
                                ?.assessmentProblems ?? 0}
                            </p>

                            <p className="text-muted-foreground">
                              Submissions:{" "}
                              {problem._count
                                ?.submissions ?? 0}
                            </p>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="max-w-[180px]">
                            <p className="truncate text-sm font-medium">
                              {problem.createdBy?.name ??
                                "Unknown"}
                            </p>

                            <p className="truncate text-xs text-muted-foreground">
                              {problem.createdBy?.email ??
                                "—"}
                            </p>
                          </div>
                        </TableCell>

                        <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                          {formatDate(problem.createdAt)}
                        </TableCell>

                        <TableCell>
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={`View ${problem.title}`}
                              title="View details"
                              onClick={() =>
                                setSelectedProblemId(
                                  problem.id,
                                )
                              }
                            >
                              <Eye className="size-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={`Delete ${problem.title}`}
                              title="Delete problem"
                              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                              onClick={() =>
                                setProblemToDelete(problem)
                              }
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex flex-col gap-2 border-t px-5 py-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                <p>
                  Showing {problems.length} matching{" "}
                  {problems.length === 1
                    ? "problem"
                    : "problems"}
                </p>

                {isFetching && (
                  <span className="flex items-center gap-2">
                    <Loader2 className="size-3.5 animate-spin" />
                    Updating...
                  </span>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Problem details */}
      <AdminProblemDetailsDialog
        problemId={selectedProblemId}
        open={Boolean(selectedProblemId)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedProblemId(null);
          }
        }}
      />

      {/* Delete confirmation */}
      <AlertDialog
        open={Boolean(problemToDelete)}
        onOpenChange={(open) => {
          if (
            !open &&
            !deleteProblem.isPending
          ) {
            setProblemToDelete(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete this problem?
            </AlertDialogTitle>

            <AlertDialogDescription>
              You are about to delete{" "}
              <span className="font-semibold text-foreground">
                {problemToDelete?.title}
              </span>
              . This action cannot be undone.

              <br />
              <br />

              Problems already used in assessments, submissions,
              candidate answers, or results cannot be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleteProblem.isPending}
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={deleteProblem.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={(event) => {
                event.preventDefault();
                handleDelete();
              }}
            >
              {deleteProblem.isPending && (
                <Loader2 className="mr-2 size-4 animate-spin" />
              )}

              {deleteProblem.isPending
                ? "Deleting..."
                : "Delete problem"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}