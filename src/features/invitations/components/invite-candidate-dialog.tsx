"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Check,
  Loader2,
  Search,
  UserPlus,
} from "lucide-react";

import {
  Button,
} from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Input,
} from "@/components/ui/input";

import {
  Label,
} from "@/components/ui/label";

import {
  ScrollArea,
} from "@/components/ui/scroll-area";

import {
  Badge,
} from "@/components/ui/badge";

import {
  useCandidates,
} from "@/features/candidates/hooks";

import {
  useCreateInvitation,
} from "../hooks";

import type {
  Candidate,
} from "@/features/candidates/types";

interface InviteCandidateDialogProps {
  assessmentId: string;
  children?: React.ReactNode;
}

export function InviteCandidateDialog({
  assessmentId,
  children,
}: InviteCandidateDialogProps) {
  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [selectedCandidate, setSelectedCandidate] =
    useState<Candidate | null>(null);

  const [expiresAt, setExpiresAt] = useState("");

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

  const handleInvite = () => {
    if (!selectedCandidate) {
      return;
    }

    createInvitationMutation.mutate(
      {
        assessmentId,
        candidateId: selectedCandidate.id,
        ...(expiresAt
          ? {
              expiresAt: new Date(
                expiresAt,
              ).toISOString(),
            }
          : {}),
      },
      {
        onSuccess: () => {
          setSelectedCandidate(null);
          setSearch("");
          setDebouncedSearch("");
          setExpiresAt("");
          setOpen(false);
        },
      },
    );
  };

  const handleOpenChange = (value: boolean) => {
    setOpen(value);

    if (!value) {
      setSelectedCandidate(null);
      setSearch("");
      setDebouncedSearch("");
      setExpiresAt("");
    }
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

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Invite Candidate
          </DialogTitle>

          <DialogDescription>
            Select a candidate to invite to this assessment.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="candidate-search">
              Search Candidate
            </Label>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                id="candidate-search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search by name or email..."
                className="pl-9"
              />
            </div>
          </div>

          {/* Candidate list */}
          <div className="rounded-lg border">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <p className="text-sm font-medium">
                Candidates
              </p>

              {isFetching && !isLoading && (
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
              )}
            </div>

            <ScrollArea className="h-16">
              <div className="p-2">
                {isLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="size-5 animate-spin text-muted-foreground" />
                  </div>
                ) : isError ? (
                  <div className="py-10 text-center text-sm text-destructive">
                    Failed to load candidates.
                  </div>
                ) : candidates.length === 0 ? (
                  <div className="py-10 text-center text-sm text-muted-foreground">
                    No candidates found.
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
                              setSelectedCandidate(
                                candidate,
                              )
                            }
                            className={`flex w-full items-center justify-between rounded-md border p-3 text-left transition-colors ${
                              isSelected
                                ? "border-primary bg-primary/5"
                                : "border-transparent hover:bg-muted"
                            }`}
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
                              <Check className="size-4 shrink-0 text-primary" />
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

          {/* Selected candidate */}
          {selectedCandidate && (
            <div className="rounded-lg border bg-muted/40 p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium">
                    Selected Candidate
                  </p>

                  <p className="truncate text-sm text-muted-foreground">
                    {selectedCandidate.name}{" "}
                    ·{" "}
                    {selectedCandidate.email}
                  </p>
                </div>

                <Badge variant="secondary">
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
              onChange={(event) =>
                setExpiresAt(event.target.value)
              }
              min={new Date()
                .toISOString()
                .slice(0, 16)}
            />

            <p className="text-xs text-muted-foreground">
              After this time, the candidate will not be
              able to accept the invitation.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
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
                <Loader2 className="mr-2 size-4 animate-spin" />
                Sending...
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