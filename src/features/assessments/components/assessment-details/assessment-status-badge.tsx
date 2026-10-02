import { Badge } from "@/components/ui/badge";

import {
  AssessmentStatus,
  type AssessmentStatus as AssessmentStatusType,
} from "@/features/assessments";

interface AssessmentStatusBadgeProps {
  status: AssessmentStatusType;
}

export function AssessmentStatusBadge({
  status,
}: AssessmentStatusBadgeProps) {
  switch (status) {
    case AssessmentStatus.DRAFT:
      return (
        <Badge variant="secondary">
          Draft
        </Badge>
      );

    case AssessmentStatus.PUBLISHED:
      return (
        <Badge variant="default">
          Published
        </Badge>
      );

    case AssessmentStatus.ACTIVE:
      return (
        <Badge variant="default">
          Active
        </Badge>
      );

    case AssessmentStatus.CLOSED:
      return (
        <Badge variant="outline">
          Closed
        </Badge>
      );

    default:
      return (
        <Badge variant="outline">
          {status}
        </Badge>
      );
  }
}