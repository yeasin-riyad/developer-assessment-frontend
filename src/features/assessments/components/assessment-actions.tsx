"use client";

import { useState } from "react";
import { Loader2, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  usePublishAssessment,
  useUnpublishAssessment,
} from "@/features/assessments/hooks";

interface AssessmentActionsProps {
  assessment: {
    id: string;
    status: string;
  };
}

export function AssessmentActions({
  assessment,
}: AssessmentActionsProps) {
  const publishMutation = usePublishAssessment();
  const unpublishMutation = useUnpublishAssessment();

  const isPending =
    publishMutation.isPending ||
    unpublishMutation.isPending;

  const handlePublish = () => {
    publishMutation.mutate(assessment.id);
  };

  const handleUnpublish = () => {
    unpublishMutation.mutate(assessment.id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline" size="icon">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {assessment.status === "DRAFT" && (
          <DropdownMenuItem
            disabled={isPending}
            onClick={handlePublish}
          >
            {isPending && (
              <Loader2 className="mr-2 size-4 animate-spin" />
            )}
            Publish Assessment
          </DropdownMenuItem>
        )}

        {assessment.status === "PUBLISHED" && (
          <DropdownMenuItem
            disabled={isPending}
            onClick={handleUnpublish}
          >
            {isPending && (
              <Loader2 className="mr-2 size-4 animate-spin" />
            )}
            Unpublish Assessment
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}