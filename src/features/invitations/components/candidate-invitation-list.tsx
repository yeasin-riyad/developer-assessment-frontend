
"use client";
import { useRouter } from "next/navigation";

import {
  useState,
} from "react";

import {
  AlertCircle,
  CalendarClock,
  Check,
  Clock3,
  FileText,
  Loader2,
  X,
} from "lucide-react";

import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  useAcceptInvitation,
  useDeclineInvitation,
  useMyCandidateInvitations,
} from "../hooks";

import type {
  CandidateInvitation,
} from "../types";

/**
 * Format date for Bangladesh users.
 */
function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-BD", {
    timeZone: "Asia/Dhaka",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

/**
 * Status badge.
 */
function getStatusVariant(
  status: CandidateInvitation["status"],
) {
  switch (status) {
    case "ACCEPTED":
      return "default";

    case "DECLINED":
      return "destructive";

    case "EXPIRED":
      return "outline";

    case "INVITED":
    default:
      return "secondary";
  }
}

/**
 * Candidate invitation card.
 */
function CandidateInvitationCard({
  invitation,
}: {
  invitation: CandidateInvitation;
}) {
  const [isDeclineConfirming, setIsDeclineConfirming] =
    useState(false);

  const acceptMutation =
    useAcceptInvitation();

  const declineMutation =
    useDeclineInvitation();

  const isAccepting =
    acceptMutation.isPending &&
    acceptMutation.variables === invitation.id;

  const isDeclining =
    declineMutation.isPending &&
    declineMutation.variables === invitation.id;

  const isPending =
    isAccepting || isDeclining;

    const router = useRouter();

  /**
   * Accept invitation.
   */
const handleAccept = () => {
  acceptMutation.mutate(invitation.id, {
    onSuccess: (response) => {
      toast.success(
        "Invitation accepted successfully!",
        {
          description: `You are now ready to take "${invitation.assessment.title}".`,
          duration: 4000,
        },
      );

      const attemptId = response.data.attempt.id;
      const assessmentId = response.data.invitation.assessmentId;

      router.push(
        `/assessments/${assessmentId}/attempt/${attemptId}`,
      );
    },

    onError: (error) => {
      toast.error(
        "Failed to accept invitation",
        {
          description: getErrorMessage(error),
          duration: 5000,
        },
      );
    },
  });
};

  /**
   * Decline invitation.
   */
  const handleDecline = () => {
    declineMutation.mutate(invitation.id, {
      onSuccess: () => {
        toast.success(
          "Invitation declined",
          {
            description:
              `You declined the invitation for "${invitation.assessment.title}".`,
            duration: 4000,
          },
        );

        setIsDeclineConfirming(false);
      },

      onError: (error) => {
        toast.error(
          "Failed to decline invitation",
          {
            description:
              getErrorMessage(error),
            duration: 5000,
          },
        );
      },
    });
  };

  const isActionDisabled =
    invitation.status !== "INVITED" ||
    acceptMutation.isPending ||
    declineMutation.isPending;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <CardTitle className="truncate text-lg">
              {invitation.assessment.title}
            </CardTitle>

            {invitation.assessment.description && (
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {invitation.assessment.description}
              </p>
            )}
          </div>

          <Badge
            variant={getStatusVariant(
              invitation.status,
            )}
            className="shrink-0"
          >
            {invitation.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Assessment information */}
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-2 rounded-lg border p-3">
            <Clock3 className="size-4 text-muted-foreground" />

            <div>
              <p className="text-xs text-muted-foreground">
                Duration
              </p>

              <p className="text-sm font-medium">
                {invitation.assessment.duration} minutes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg border p-3">
            <FileText className="size-4 text-muted-foreground" />

            <div>
              <p className="text-xs text-muted-foreground">
                Total Marks
              </p>

              <p className="text-sm font-medium">
                {invitation.assessment.totalMarks}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg border p-3">
            <CalendarClock className="size-4 text-muted-foreground" />

            <div>
              <p className="text-xs text-muted-foreground">
                Invited
              </p>

              <p className="text-sm font-medium">
                {formatDate(invitation.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Expiry */}
        {invitation.expiresAt && (
          <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-3">
            <CalendarClock className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

            <div>
              <p className="text-sm font-medium">
                Invitation expires
              </p>

              <p className="text-xs text-muted-foreground">
                {formatDate(invitation.expiresAt)}
              </p>
            </div>
          </div>
        )}

        {/* Status messages */}
        {invitation.status === "ACCEPTED" && (
          <div className="flex items-start gap-2 rounded-lg border border-green-500/20 bg-green-500/10 p-3">
            <Check className="mt-0.5 size-4 shrink-0 text-green-600" />

            <div>
              <p className="text-sm font-medium">
                Invitation accepted
              </p>

              <p className="text-xs text-muted-foreground">
                You can continue to the assessment when
                it is available.
              </p>
            </div>
          </div>
        )}

        {invitation.status === "DECLINED" && (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3">
            <X className="mt-0.5 size-4 shrink-0 text-destructive" />

            <div>
              <p className="text-sm font-medium">
                Invitation declined
              </p>

              <p className="text-xs text-muted-foreground">
                You declined this assessment invitation.
              </p>
            </div>
          </div>
        )}

        {invitation.status === "EXPIRED" && (
          <div className="flex items-start gap-2 rounded-lg border bg-muted/50 p-3">
            <AlertCircle className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

            <div>
              <p className="text-sm font-medium">
                Invitation expired
              </p>

              <p className="text-xs text-muted-foreground">
                This invitation can no longer be accepted.
              </p>
            </div>
          </div>
        )}
      </CardContent>

      {/* Actions */}
      {invitation.status === "INVITED" && (
        <CardFooter className="flex flex-col gap-2 border-t bg-muted/20 p-4 sm:flex-row sm:justify-end">
          {!isDeclineConfirming ? (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setIsDeclineConfirming(true)
                }
                disabled={isActionDisabled}
              >
                <X className="mr-2 size-4" />

                Decline
              </Button>

              <Button
                type="button"
                onClick={handleAccept}
                disabled={isActionDisabled}
              >
                {isAccepting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />

                    Accepting...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 size-4" />

                    Accept Invitation
                  </>
                )}
              </Button>
            </>
          ) : (
            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium">
                  Decline this invitation?
                </p>

                <p className="text-xs text-muted-foreground">
                  This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() =>
                    setIsDeclineConfirming(false)
                  }
                  disabled={isDeclining}
                >
                  Cancel
                </Button>

                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDecline}
                  disabled={isDeclining}
                >
                  {isDeclining ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />

                      Declining...
                    </>
                  ) : (
                    <>
                      <X className="mr-2 size-4" />

                      Yes, Decline
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
}

/**
 * Extract backend error message.
 */
function getErrorMessage(
  error: unknown,
): string {
  if (
    error instanceof Error &&
    error.message
  ) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error !== null
  ) {
    const errorObject = error as {
      message?: unknown;

      response?: {
        _data?: {
          message?: unknown;
        };
      };

      data?: {
        message?: unknown;
      };
    };

    if (
      typeof errorObject.response?._data?.message ===
      "string"
    ) {
      return errorObject.response._data.message;
    }

    if (
      typeof errorObject.data?.message === "string"
    ) {
      return errorObject.data.message;
    }

    if (
      typeof errorObject.message === "string"
    ) {
      return errorObject.message;
    }
  }

  return "Something went wrong. Please try again.";
}

/**
 * Candidate invitation list.
 */
export function CandidateInvitationList() {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useMyCandidateInvitations();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="size-7 animate-spin text-muted-foreground" />

        <p className="mt-3 text-sm text-muted-foreground">
          Loading your invitations...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-8 text-center">
        <AlertCircle className="mx-auto size-8 text-destructive" />

        <h3 className="mt-3 font-medium">
          Failed to load invitations
        </h3>

        <p className="mt-1 text-sm text-muted-foreground">
          {getErrorMessage(error)}
        </p>

        <Button
          type="button"
          variant="outline"
          className="mt-4"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          {isFetching ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />

              Retrying...
            </>
          ) : (
            "Try Again"
          )}
        </Button>
      </div>
    );
  }

  const invitations = data?.data ?? [];

  if (invitations.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <FileText className="mx-auto size-10 text-muted-foreground" />

        <h3 className="mt-4 font-medium">
          No invitations yet
        </h3>

        <p className="mt-1 text-sm text-muted-foreground">
          You don't have any assessment invitations at
          the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {invitations.map((invitation) => (
        <CandidateInvitationCard
          key={invitation.id}
          invitation={invitation}
        />
      ))}
    </div>
  );
}

