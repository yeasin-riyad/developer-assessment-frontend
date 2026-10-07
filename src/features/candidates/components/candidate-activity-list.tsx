"use client";

import {
  CalendarClock,
  CheckCircle2,
  Clock3,
  FileText,
  Trophy,
  XCircle,
} from "lucide-react";

import { useCandidateActivities } from "../hooks";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface CandidateActivityListProps {
  candidateId: string;
}

function getStatusVariant(status?: string | null) {
  switch (status) {
    case "ACCEPTED":
    case "SUBMITTED":
    case "PASSED":
      return "default" as const;

    case "DECLINED":
    case "EXPIRED":
    case "FAILED":
      return "destructive" as const;

    default:
      return "secondary" as const;
  }
}

function formatStatus(status?: string | null) {
  if (!status) {
    return "Not available";
  }

  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(value?: string | null) {
  if (!value) {
    return "—";
  }

  return new Date(value).toLocaleString("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function CandidateActivityList({
  candidateId,
}: CandidateActivityListProps) {
  const { data, isLoading, error } = useCandidateActivities(candidateId, {
    page: 1,
    limit: 20,
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="space-y-3 p-5">
              <Skeleton className="h-5 w-56" />
              <Skeleton className="h-4 w-72" />
              <Skeleton className="h-4 w-48" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <p className="font-medium text-red-600">
            Unable to load candidate activity
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Something went wrong while loading the candidate activity.
          </p>
        </CardContent>
      </Card>
    );
  }

  const activities = data?.data?.activities ?? [];

  if (activities.length === 0) {
    return (
      <Card>
        <CardContent className="flex min-h-40 items-center justify-center text-center">
          <div>
            <Clock3 className="mx-auto mb-3 h-6 w-6 text-muted-foreground" />

            <p className="font-medium">No activity yet</p>

            <p className="mt-1 text-sm text-muted-foreground">
              Candidate invitation and assessment activity will appear here.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const invitation = activity.invitation;
        const attempt = activity.attempt;
        const result = activity.result;
        const assessment = activity.assessment;

        return (
          <Card key={invitation.id}>
            {/* Assessment Header */}
            <CardHeader className="pb-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileText className="h-4 w-4 text-primary" />

                    {assessment.title}
                  </CardTitle>

                  <p className="text-sm text-muted-foreground">
                    {assessment.totalMarks} marks
                    {" • "}
                    {assessment.duration} minutes
                  </p>
                </div>

                {/* Result Status */}
                {result ? (
                  <Badge variant={getStatusVariant(result.status)}>
                    {formatStatus(result.status)}
                  </Badge>
                ) : attempt ? (
                  <Badge variant={getStatusVariant(attempt.status)}>
                    {formatStatus(attempt.status)}
                  </Badge>
                ) : (
                  <Badge variant={getStatusVariant(invitation.status)}>
                    {formatStatus(invitation.status)}
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent>
              {/* Activity Summary */}
              <div className="grid gap-3 md:grid-cols-3">
                {/* Invitation */}
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-2">
                    <CalendarClock className="h-4 w-4 text-muted-foreground" />

                    <p className="text-xs font-medium text-muted-foreground">
                      Invitation
                    </p>
                  </div>

                  <Badge
                    className="mt-3"
                    variant={getStatusVariant(invitation.status)}
                  >
                    {formatStatus(invitation.status)}
                  </Badge>

                  <p className="mt-2 text-xs text-muted-foreground">
                    Invited {formatDate(invitation.createdAt)}
                  </p>
                </div>

                {/* Attempt */}
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4 text-muted-foreground" />

                    <p className="text-xs font-medium text-muted-foreground">
                      Attempt
                    </p>
                  </div>

                  {attempt ? (
                    <>
                      <Badge
                        className="mt-3"
                        variant={getStatusVariant(attempt.status)}
                      >
                        {formatStatus(attempt.status)}
                      </Badge>

                      {attempt.startedAt && (
                        <p className="mt-2 text-xs text-muted-foreground">
                          Started {formatDate(attempt.startedAt)}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="mt-3 text-sm text-muted-foreground">
                      Not started
                    </p>
                  )}
                </div>

                {/* Result */}
                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-muted-foreground" />

                    <p className="text-xs font-medium text-muted-foreground">
                      Result
                    </p>
                  </div>

                  {result ? (
                    <>
                      <p className="mt-3 text-lg font-semibold">
                        {result.obtainedMarks}
                        <span className="text-sm font-normal text-muted-foreground">
                          {" / "}
                          {result.totalMarks}
                        </span>
                      </p>

                      <p className="text-sm text-muted-foreground">
                        {result.percentage.toFixed(1)}%
                      </p>

                      <Badge
                        className="mt-2"
                        variant={getStatusVariant(result.status)}
                      >
                        {formatStatus(result.status)}
                      </Badge>
                    </>
                  ) : (
                    <p className="mt-3 text-sm text-muted-foreground">
                      Not available
                    </p>
                  )}
                </div>
              </div>

              {/* Timeline */}
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 border-t pt-4 text-xs text-muted-foreground">
                {/* Invitation Created */}
                <span className="flex items-center gap-1.5">
                  <CalendarClock className="h-3.5 w-3.5" />
                  Invited {formatDate(invitation.createdAt)}
                </span>

                {/* Attempt Started */}
                {attempt?.startedAt && (
                  <span className="flex items-center gap-1.5">
                    <Clock3 className="h-3.5 w-3.5" />
                    Started {formatDate(attempt.startedAt)}
                  </span>
                )}

                {/* Attempt Submitted */}
                {attempt?.submittedAt && (
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Submitted {formatDate(attempt.submittedAt)}
                  </span>
                )}

                {/* Invitation Expiry */}
                {invitation.expiresAt && (
                  <span className="flex items-center gap-1.5">
                    <XCircle className="h-3.5 w-3.5" />
                    Invitation expires {formatDate(invitation.expiresAt)}
                  </span>
                )}

                {/* Attempt Expiry */}
                {attempt?.expiresAt && (
                  <span className="flex items-center gap-1.5">
                    <XCircle className="h-3.5 w-3.5" />
                    Attempt expires {formatDate(attempt.expiresAt)}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
