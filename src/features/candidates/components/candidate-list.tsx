"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Mail,
  Search,
  UserRound,
  Users,
} from "lucide-react";

import { useCandidates } from "../hooks";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CandidateList() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const limit = 10;

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, isFetching, error } = useCandidates({
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

        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-56" />
                  </div>
                </div>
                <Skeleton className="h-9 w-28 rounded-md" />
              </div>
            </CardContent>
          </Card>
        ))}
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
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
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

            <h3 className="font-semibold">No candidates found</h3>

            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              {search
                ? "Try a different name or email address."
                : "Candidates related to your assessments will appear here."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {candidates.map((candidate) => (
            <Card
              key={candidate.id}
              className="group overflow-hidden transition-all duration-200 hover:border-primary/40 hover:shadow-sm"
            >
              <CardContent className="p-0">
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  {/* Candidate info */}
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/15 to-primary/5 text-base font-semibold text-primary ring-1 ring-primary/10">
                      {candidate.name?.charAt(0)?.toUpperCase() || (
                        <UserRound className="h-5 w-5" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="truncate font-semibold leading-tight">
                          {candidate.name}
                        </h3>

                        <Badge
                          variant={
                            candidate.isActive ? "default" : "secondary"
                          }
                          className="shrink-0"
                        >
                          {candidate.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>

                      <div className="mt-1.5 flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{candidate.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  <Button
                    asChild
                    variant="outline"
                    className="w-full shrink-0 justify-center gap-2 group-hover:border-primary/40 group-hover:text-primary sm:w-auto"
                  >
                    <Link href={`/candidates/${candidate.id}`}>
                      View details
                      {/* <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" /> */}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 0 && (
        <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages}
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1 || isFetching}
              onClick={() =>
                setPage((current) => Math.max(1, current - 1))
              }
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Previous
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={page >= pagination.totalPages || isFetching}
              onClick={() =>
                setPage((current) =>
                  Math.min(pagination.totalPages, current + 1),
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