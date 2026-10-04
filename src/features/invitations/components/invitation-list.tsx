"use client";

import {
  Loader2,
  Mail,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import { useMyInvitations } from "../hooks";

function getStatusVariant(
  status: string,
) {
  switch (status) {
    case "ACCEPTED":
      return "default";

    case "DECLINED":
      return "destructive";

    case "EXPIRED":
      return "outline";

    default:
      return "secondary";
  }
}

export function InvitationList() {
  const {
    data,
    isLoading,
    isError,
  } = useMyInvitations();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center">
        <p className="text-sm text-destructive">
          Failed to load invitations.
        </p>
      </div>
    );
  }

  const invitations = data?.data ?? [];

  if (invitations.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Mail className="mb-3 size-8 text-muted-foreground" />

          <h3 className="font-medium">
            No invitations yet
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Invitations you send to candidates will appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {invitations.map((invitation) => (
        <Card key={invitation.id}>
          <CardContent className="flex items-center justify-between gap-4 p-4">
            <div className="min-w-0">
              <p className="font-medium">
                {invitation.candidate?.name ??
                  "Unknown Candidate"}
              </p>

              <p className="text-sm text-muted-foreground">
                {invitation.candidate?.email ??
                  "No email"}
              </p>

              <p className="mt-1 text-sm">
                {invitation.assessment?.title ??
                  "Unknown Assessment"}
              </p>
            </div>

            <div className="shrink-0 text-right">
              <Badge
                variant={getStatusVariant(
                  invitation.status,
                )}
              >
                {invitation.status}
              </Badge>

              {invitation.expiresAt && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Expires{" "}
                  {new Date(
                    invitation.expiresAt,
                  ).toLocaleDateString()}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}