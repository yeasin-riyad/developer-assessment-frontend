import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  FileQuestion,
  Pencil,
  Trophy,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { Assessment } from "@/features/assessments";
import { AssessmentStatusBadge } from "./assessment-details/assessment-status-badge";


interface AssessmentCardProps {
  assessment: Assessment;
}

export function AssessmentCard({
  assessment,
}: AssessmentCardProps) {
  return (
    <Card className="group flex h-full flex-col transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 space-y-2">
            <CardTitle className="line-clamp-2 text-lg">
              {assessment.title}
            </CardTitle>

            <AssessmentStatusBadge
              status={assessment.status}
            />
          </div>

          <div className="shrink-0 rounded-lg bg-muted p-2">
            <FileQuestion className="size-5 text-muted-foreground" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        {assessment.description ? (
          <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
            {assessment.description}
          </p>
        ) : (
          <p className="text-sm italic text-muted-foreground">
            No description provided.
          </p>
        )}

        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="rounded-lg border bg-muted/30 p-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock3 className="size-4" />

              <span className="text-xs">
                Duration
              </span>
            </div>

            <p className="mt-1 text-sm font-semibold">
              {assessment.duration} min
            </p>
          </div>

          <div className="rounded-lg border bg-muted/30 p-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileQuestion className="size-4" />

              <span className="text-xs">
                Problems
              </span>
            </div>

            <p className="mt-1 text-sm font-semibold">
              {assessment.problems.length}
            </p>
          </div>

          <div className="rounded-lg border bg-muted/30 p-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Trophy className="size-4" />

              <span className="text-xs">
                Marks
              </span>
            </div>

            <p className="mt-1 text-sm font-semibold">
              {assessment.totalMarks}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t bg-muted/20">
        <Link
          href={`/assessments/${assessment.id}`}
          className="inline-flex h-9 w-full items-center justify-center rounded-md px-3 text-sm font-medium transition-colors hover:bg-muted"
        >
          View Assessment

          <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </CardFooter>
    </Card>
  );
}