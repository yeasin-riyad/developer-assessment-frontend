"use client";

import {
  ArrowLeft,
  Edit,
  UserPlus,
} from "lucide-react";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { AssessmentActions } from "../assessment-actions";

import { InviteCandidateDialog } from "@/features/invitations/components/invite-candidate-dialog";

interface AssessmentHeaderProps {
  assessment: {
    id: string;
    title: string;
    description?: string | null;
    status: string;
  };
}

export function AssessmentHeader({
  assessment,
}: AssessmentHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <Link
            href="/assessments"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to assessments
          </Link>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">
              {assessment.title}
            </h1>

            <Badge variant="secondary">
              {assessment.status}
            </Badge>
          </div>

          {assessment.description && (
            <p className="max-w-3xl text-sm text-muted-foreground">
              {assessment.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {assessment.status === "DRAFT" && (
            <Button
              variant="outline"
              asChild
            >
              <Link
                href={`/assessments/${assessment.id}/edit`}
              >
                <Edit className="mr-2 size-4" />
                Edit
              </Link>
            </Button>
          )}

          {assessment.status === "PUBLISHED" && (
            <InviteCandidateDialog
              assessmentId={assessment.id}
            >
              <Button>
                <UserPlus className="mr-2 size-4" />
                Invite Candidate
              </Button>
            </InviteCandidateDialog>
          )}

          <AssessmentActions
            assessment={assessment}
          />
        </div>
      </div>
    </div>
  );
}