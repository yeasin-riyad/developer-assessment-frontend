"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

import { useProblems } from "../hooks";

import { ProblemCard } from "./problem-card";

const ITEMS_PER_PAGE = 3;

export function ProblemList() {
  const [page, setPage] = useState(1);

  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
  } = useProblems({
    page,
    limit: ITEMS_PER_PAGE,
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: ITEMS_PER_PAGE }).map(
          (_, index) => (
            <div
              key={index}
              className="space-y-4 rounded-xl border p-6"
            >
              <Skeleton className="h-6 w-3/4" />

              <Skeleton className="h-4 w-1/2" />

              <Skeleton className="h-16 w-full" />

              <Skeleton className="h-9 w-full" />
            </div>
          ),
        )}
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>
          Failed to load problems
        </AlertTitle>

        <AlertDescription>
          {error instanceof Error
            ? error.message
            : "Something went wrong while loading problems."}
        </AlertDescription>
      </Alert>
    );
  }

  const problems = data?.data ?? [];
  const pagination = data?.pagination;

  if (
    problems.length === 0 &&
    page === 1
  ) {
    return (
      <div className="rounded-xl border border-dashed p-12 text-center">
        <h3 className="text-lg font-semibold">
          No problems found
        </h3>

        <p className="mt-2 text-sm text-muted-foreground">
          Create your first problem to get started.
        </p>

        <Button className="mt-5" asChild>
          <Link href="/problems/create">
            <Plus className="mr-2 size-4" />
            Create Problem
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Problems */}
      <div
        className={`grid gap-4 md:grid-cols-2 xl:grid-cols-3 ${
          isFetching ? "opacity-60" : ""
        }`}
      >
        {problems.map((problem) => (
          <ProblemCard
            key={problem.id}
            problem={problem}
          />
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t pt-4">
          <div className="text-sm text-muted-foreground">
            Page{" "}
            <span className="font-medium text-foreground">
              {pagination.page}
            </span>{" "}
            of{" "}
            <span className="font-medium text-foreground">
              {pagination.totalPages}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={
                !pagination.hasPreviousPage ||
                isFetching
              }
              onClick={() =>
                setPage((current) =>
                  Math.max(current - 1, 1),
                )
              }
            >
              Previous
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={
                !pagination.hasNextPage ||
                isFetching
              }
              onClick={() =>
                setPage((current) =>
                  current + 1,
                )
              }
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}