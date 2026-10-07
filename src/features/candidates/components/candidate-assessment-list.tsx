"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
} from "lucide-react";

import { useCandidateAssessments } from "../hooks";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface CandidateAssessmentListProps {
  candidateId: string;
}

function getStatusVariant(
  status: string,
) {
  if (
    status === "SUBMITTED" ||
    status === "PASSED"
  ) {
    return "default" as const;
  }

  if (
    status === "EXPIRED" ||
    status === "FAILED"
  ) {
    return "destructive" as const;
  }

  return "secondary" as const;
}

export function CandidateAssessmentList({
  candidateId,
}: CandidateAssessmentListProps) {
  const {
    data,
    isLoading,
    error,
  } = useCandidateAssessments(candidateId, {
    page: 1,
    limit: 20,
  });

  console.log(data)

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map(
          (_, index) => (
            <Card key={index}>
              <CardContent className="space-y-3 p-5">
                <Skeleton className="h-5 w-52" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-8 w-24" />
              </CardContent>
            </Card>
          ),
        )}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <p className="font-medium text-red-600">
            Unable to load assessments
          </p>
        </CardContent>
      </Card>
    );
  }

  const assessments =
    data?.data?.assessments ?? [];
    console.log(assessments)

  if (assessments.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <Clock3 className="mx-auto mb-3 h-6 w-6 text-muted-foreground" />

          <p className="font-medium">
            No assessment attempts
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            This candidate has not started an assessment
            yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {assessments.map((item) => (
        <Card key={item.id}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="h-4 w-4 text-primary" />

                  {item.assessment.title}
                </CardTitle>

                <p className="mt-1 text-sm text-muted-foreground">
                  {item.assessment.duration} minutes
                  {" • "}
                  {item.assessment.totalMarks} marks
                </p>
              </div>

              <Badge
                variant={getStatusVariant(
                  item.status,
                )}
              >
                {item.status}
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                {item.result ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />

                    <span className="text-sm font-medium">
                      {item.result.obtainedMarks}
                      {" / "}
                      {item.result.totalMarks}
                      {" — "}
                      {item.result.percentage.toFixed(
                        1,
                      )}
                      %
                    </span>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Result not available
                  </p>
                )}
              </div>

              {item.result && (
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <Link
                    href={`/assessments/attempts/${item.id}/result`}
                  >
                    View Result
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}