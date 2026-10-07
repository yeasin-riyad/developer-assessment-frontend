"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Mail,
  Search,
  Users,
} from "lucide-react";

import { useCandidates } from "../hooks";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CandidateList() {
  const [searchInput, setSearchInput] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [page, setPage] = useState(1);

  const limit = 10;

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, isFetching, error } =
    useCandidates({
      page,
      limit,
      search,
    });

  const candidates = data?.data?.candidates ?? [];
  const pagination = data?.data?.pagination;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />

        {Array.from({ length: 5 }).map(
          (_, index) => (
            <Card key={index}>
              <CardContent className="p-5">
                <div className="space-y-3">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-64" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </CardContent>
            </Card>
          ),
        )}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex min-h-40 items-center justify-center">
          <div className="text-center">
            <p className="font-medium text-red-600">
              Unable to load candidates
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Please refresh the page and try again.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={searchInput}
          onChange={(event) =>
            setSearchInput(event.target.value)
          }
          placeholder="Search candidates by name or email..."
          className="pl-9"
        />
      </div>

      {isFetching && (
        <p className="text-xs text-muted-foreground">
          Updating candidates...
        </p>
      )}

      {candidates.length === 0 ? (
        <Card>
          <CardContent className="flex min-h-64 flex-col items-center justify-center text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <Users className="h-6 w-6 text-muted-foreground" />
            </div>

            <h3 className="font-semibold">
              No candidates found
            </h3>

            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              {search
                ? "Try a different name or email address."
                : "Candidates related to your assessments will appear here."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {candidates.map((candidate) => (
            <Link
              key={candidate.id}
              href={`/candidates/${candidate.id}`}
              className="block"
            >
              <Card className="transition-colors hover:border-primary/40 hover:bg-muted/30">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                          {candidate.name
                            ?.charAt(0)
                            ?.toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate font-semibold">
                            {candidate.name}
                          </h3>

                          <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-3.5 w-3.5" />

                            <span className="truncate">
                              {candidate.email}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Badge
                      variant={
                        candidate.isActive
                          ? "default"
                          : "secondary"
                      }
                    >
                      {candidate.isActive
                        ? "Active"
                        : "Inactive"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {pagination &&
        pagination.totalPages > 0 && (
          <div className="flex items-center justify-between border-t pt-4">
            <p className="text-sm text-muted-foreground">
              Page {pagination.page} of{" "}
              {pagination.totalPages}
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={
                  page <= 1 || isFetching
                }
                onClick={() =>
                  setPage((current) =>
                    Math.max(1, current - 1),
                  )
                }
              >
                <ChevronLeft className="mr-1 h-4 w-4" />
                Previous
              </Button>

              <Button
                variant="outline"
                size="sm"
                disabled={
                  page >=
                    pagination.totalPages ||
                  isFetching
                }
                onClick={() =>
                  setPage((current) =>
                    Math.min(
                      pagination.totalPages,
                      current + 1,
                    ),
                  )
                }
              >
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
    </div>
  );
}