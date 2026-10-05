
"use client";

import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  Check,
  Loader2,
  Search,
  UserPlus,
} from "lucide-react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

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

import { Label } from "@/components/ui/label";

import { ScrollArea } from "@/components/ui/scroll-area";

import { Badge } from "@/components/ui/badge";

import { useCandidates } from "@/features/candidates/hooks";

import { useCreateInvitation } from "../hooks";

import type { Candidate } from "@/features/candidates/types";

interface InviteCandidateDialogProps {
  assessmentId: string;
  children?: ReactNode;
}

/**
 * Bangladesh timezone.
 */
const BANGLADESH_TIMEZONE = "Asia/Dhaka";

/**
 * Format current date/time for a datetime-local input.
 *
 * Example:
 * 2026-10-05T11:30
 */
function getBangladeshDateTimeLocal(): string {
  const now = new Date();

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: BANGLADESH_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);

  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );

  return `${values.year}-${values.month}-${values.day}T${values.hour}:${values.minute}`;
}

/**
 * Convert Bangladesh local datetime to an ISO timestamp.
 *
 * datetime-local does not contain timezone information.
 * This function treats the value as Asia/Dhaka time.
 *
 * Example:
 * 2026-10-05T18:30
 *
 * becomes approximately:
 * 2026-10-05T12:30:00.000Z
 */
function bangladeshDateTimeToISOString(
  value: string,
): string | null {
  if (!value) {
    return null;
  }

  const [datePart, timePart] = value.split("T");

  if (!datePart || !timePart) {
    return null;
  }

  const [year, month, day] = datePart
    .split("-")
    .map(Number);

  const [hour, minute] = timePart
    .split(":")
    .map(Number);

  if (
    !year ||
    !month ||
    !day ||
    Number.isNaN(hour) ||
    Number.isNaN(minute)
  ) {
    return null;
  }

  /**
   * Bangladesh is UTC+6.
   *
   * Since Bangladesh does not observe daylight saving time,
   * subtracting 6 hours gives us UTC.
   */
  const utcTimestamp = Date.UTC(
    year,
    month - 1,
    day,
    hour - 6,
    minute,
  );

  const date = new Date(utcTimestamp);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
}


function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
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

    if (typeof errorObject.message === "string") {
      return errorObject.message;
    }
  }

  return "Something went wrong. Please try again.";
}

export function InviteCandidateDialog({
  assessmentId,
  children,
}: InviteCandidateDialogProps) {
  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] =
    useState("");

  const [selectedCandidate, setSelectedCandidate] =
    useState<Candidate | null>(null);

  const [expiresAt, setExpiresAt] = useState("");

 
  const [minimumExpiry, setMinimumExpiry] =
    useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);


  const {
    data,
    isLoading,
    isFetching,
    isError,
  } = useCandidates({
    page: 1,
    limit: 10,
    search: debouncedSearch || undefined,
  });

  const createInvitationMutation =
    useCreateInvitation();

  const candidates = data?.data ?? [];

 
  useEffect(() => {
    if (open) {
      setMinimumExpiry(
        getBangladeshDateTimeLocal(),
      );
    }
  }, [open]);


  const resetForm = () => {
    setSelectedCandidate(null);
    setSearch("");
    setDebouncedSearch("");
    setExpiresAt("");
  };


  const handleOpenChange = (value: boolean) => {
  
    if (
      !value &&
      createInvitationMutation.isPending
    ) {
      return;
    }

    setOpen(value);

    if (!value) {
      resetForm();
    }
  };

 
  const handleInvite = () => {
    if (!selectedCandidate) {
      toast.error("Please select a candidate", {
        description:
          "Select a candidate before sending the invitation.",
      });

      return;
    }

  
    let formattedExpiresAt: string | undefined;

    if (expiresAt) {
      const isoDate =
        bangladeshDateTimeToISOString(expiresAt);

      if (!isoDate) {
        toast.error("Invalid expiry date", {
          description:
            "Please select a valid expiry date and time.",
        });

        return;
      }

    
      if (new Date(isoDate).getTime() <= Date.now()) {
        toast.error("Invalid expiry time", {
          description:
            "Invitation expiry must be in the future.",
        });

        return;
      }

      formattedExpiresAt = isoDate;
    }

    createInvitationMutation.mutate(
      {
        assessmentId,
        candidateId: selectedCandidate.id,
        ...(formattedExpiresAt
          ? {
              expiresAt: formattedExpiresAt,
            }
          : {}),
      },
      {
        onSuccess: () => {
          toast.success(
            "Invitation sent successfully!",
            {
              description: `${selectedCandidate.name} has been invited to this assessment.`,
              duration: 4000,
            },
          );

          resetForm();
          setOpen(false);
        },

        onError: (error) => {
          const message = getErrorMessage(error);

          toast.error(
            "Failed to send invitation",
            {
              description: message,
              duration: 5000,
            },
          );
        },
      },
    );
  };

  /**
   * Candidate selection.
   */
  const handleSelectCandidate = (
    candidate: Candidate,
  ) => {
    if (createInvitationMutation.isPending) {
      return;
    }

    setSelectedCandidate(candidate);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogTrigger asChild>
        {children ?? (
          <Button>
            <UserPlus className="mr-2 size-4" />
            Invite Candidate
          </Button>
        )}
      </DialogTrigger>

      <DialogContent
        className="
          max-h-[90vh]
          overflow-y-auto
          sm:max-w-lg
        "
      >
        <DialogHeader>
          <DialogTitle>
            Invite Candidate
          </DialogTitle>

          <DialogDescription>
            Select a candidate to invite to this
            assessment.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Candidate */}
          <div className="space-y-2">
            <Label htmlFor="candidate-search">
              Search Candidate
            </Label>

            <div className="relative">
              <Search
                className="
                  absolute
                  left-3
                  top-1/2
                  size-4
                  -translate-y-1/2
                  text-muted-foreground
                "
              />

              <Input
                id="candidate-search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search by name or email..."
                className="pl-9"
                disabled={
                  createInvitationMutation.isPending
                }
              />
            </div>
          </div>

          {/* Candidate List */}
          <div className="rounded-lg border">
            <div
              className="
                flex
                items-center
                justify-between
                border-b
                px-3
                py-2
              "
            >
              <p className="text-sm font-medium">
                Candidates
              </p>

              {isFetching && (
                <div className="flex items-center gap-2">
                  <Loader2
                    className="
                      size-4
                      animate-spin
                      text-muted-foreground
                    "
                  />

                  <span className="text-xs text-muted-foreground">
                    Searching...
                  </span>
                </div>
              )}
            </div>

            <ScrollArea className="h-40">
              <div className="p-2">
                {isLoading ? (
                  <div
                    className="
                      flex
                      flex-col
                      items-center
                      justify-center
                      gap-2
                      py-10
                    "
                  >
                    <Loader2
                      className="
                        size-5
                        animate-spin
                        text-muted-foreground
                      "
                    />

                    <p className="text-xs text-muted-foreground">
                      Loading candidates...
                    </p>
                  </div>
                ) : isError ? (
                  <div className="py-10 text-center">
                    <p className="text-sm font-medium text-destructive">
                      Failed to load candidates
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Please try searching again.
                    </p>
                  </div>
                ) : candidates.length === 0 ? (
                  <div className="py-10 text-center">
                    <p className="text-sm text-muted-foreground">
                      No candidates found.
                    </p>

                    {debouncedSearch && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Try a different name or email.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-1">
                    {candidates.map(
                      (candidate) => {
                        const isSelected =
                          selectedCandidate?.id ===
                          candidate.id;

                        return (
                          <button
                            key={candidate.id}
                            type="button"
                            onClick={() =>
                              handleSelectCandidate(
                                candidate,
                              )
                            }
                            disabled={
                              createInvitationMutation.isPending
                            }
                            className={`
                              flex
                              w-full
                              items-center
                              justify-between
                              rounded-md
                              border
                              p-3
                              text-left
                              transition-colors
                              disabled:cursor-not-allowed
                              disabled:opacity-60
                              ${
                                isSelected
                                  ? "border-primary bg-primary/5"
                                  : "border-transparent hover:bg-muted"
                              }
                            `}
                          >
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium">
                                {candidate.name}
                              </p>

                              <p className="truncate text-xs text-muted-foreground">
                                {candidate.email}
                              </p>
                            </div>

                            {isSelected && (
                              <Check
                                className="
                                  size-4
                                  shrink-0
                                  text-primary
                                "
                              />
                            )}
                          </button>
                        );
                      },
                    )}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Selected Candidate */}
          {selectedCandidate && (
            <div
              className="
                rounded-lg
                border
                bg-muted/40
                p-3
              "
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium">
                    Selected Candidate
                  </p>

                  <p className="truncate text-sm text-muted-foreground">
                    {selectedCandidate.name}
                    {" · "}
                    {selectedCandidate.email}
                  </p>
                </div>

                <Badge
                  variant="secondary"
                  className="shrink-0"
                >
                  Candidate
                </Badge>
              </div>
            </div>
          )}

          {/* Expiry */}
          <div className="space-y-2">
            <Label htmlFor="expires-at">
              Invitation Expiry

              <span className="ml-1 text-muted-foreground">
                (optional)
              </span>
            </Label>

            <Input
              id="expires-at"
              type="datetime-local"
              value={expiresAt}
              min={minimumExpiry}
              onChange={(event) =>
                setExpiresAt(event.target.value)
              }
              disabled={
                createInvitationMutation.isPending
              }
            />

            <p className="text-xs text-muted-foreground">
              Bangladesh time (Asia/Dhaka). After this
              time, the candidate will not be able to
              accept the invitation.
            </p>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              handleOpenChange(false)
            }
            disabled={
              createInvitationMutation.isPending
            }
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleInvite}
            disabled={
              !selectedCandidate ||
              createInvitationMutation.isPending
            }
          >
            {createInvitationMutation.isPending ? (
              <>
                <Loader2
                  className="
                    mr-2
                    size-4
                    animate-spin
                  "
                />

                Sending Invitation...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 size-4" />

                Send Invitation
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

