"use client";

import {
  Activity,
  CalendarDays,
  Mail,
  UserRound,
} from "lucide-react";

import { useCandidate } from "../hooks";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface CandidateDetailsProps {
  candidateId: string;
}

export function CandidateDetails({
  candidateId,
}: CandidateDetailsProps) {
  const {
    data: candidate,
    isLoading,
    error,
  } = useCandidate(candidateId);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>

          <CardContent className="space-y-4">
            <Skeleton className="h-5 w-64" />
            <Skeleton className="h-5 w-72" />
            <Skeleton className="h-5 w-40" />
          </CardContent>
        </Card>
      </div>
    );
  }

  console.log(candidate)

  if (error || !candidate?.data) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <p className="font-medium text-red-600">
            Unable to load candidate
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            This candidate may not exist or you may not
            have permission to view them.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-xl font-semibold text-primary">
              {candidate?.data?.name?.charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <CardTitle>
                {candidate?.data?.name}
              </CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                Candidate profile
              </p>
            </div>
          </div>

          <Badge
            variant={
              candidate?.data?.isActive
                ? "default"
                : "secondary"
            }
          >
            {candidate?.data?.isActive
              ? "Active"
              : "Inactive"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border p-4">
            <div className="mb-2 flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span className="text-sm">
                Email
              </span>
            </div>

            <p className="break-all text-sm font-medium">
              {candidate?.data?.email}
            </p>
          </div>

          <div className="rounded-lg border p-4">
            <div className="mb-2 flex items-center gap-2 text-muted-foreground">
              <UserRound className="h-4 w-4" />
              <span className="text-sm">
                Role
              </span>
            </div>

            <p className="text-sm font-medium">
              {candidate?.data?.role}
            </p>
          </div>

          <div className="rounded-lg border p-4">
            <div className="mb-2 flex items-center gap-2 text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              <span className="text-sm">
                Joined
              </span>
            </div>

            <p className="text-sm font-medium">
              {new Date(
                candidate?.data?.createdAt,
              ).toLocaleDateString("en-BD", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {candidate?.data?._count && (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-muted/40 p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Activity className="h-4 w-4" />
                <span className="text-sm">
                  Invitations
                </span>
              </div>

              <p className="mt-1 text-2xl font-bold">
                {candidate?.data?._count.invitations ?? 0}
              </p>
            </div>

            <div className="rounded-lg bg-muted/40 p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Activity className="h-4 w-4" />
                <span className="text-sm">
                  Attempts
                </span>
              </div>

              <p className="mt-1 text-2xl font-bold">
                {candidate?.data?._count.attempts ?? 0}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}