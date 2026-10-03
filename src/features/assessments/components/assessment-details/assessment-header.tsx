"use client";

import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AssessmentActions } from "../assessment-actions";


interface AssessmentHeaderProps {
  assessment: {
    id: string;
    title: string;
    description?: string;
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
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
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
          <Button variant="outline">
            <Link href={`/assessments/${assessment.id}/edit`}>
              <Edit className="mr-2 size-4" />
              Edit
            </Link>
          </Button>

          <AssessmentActions assessment={assessment} />
        </div>
      </div>
    </div>
  );
}