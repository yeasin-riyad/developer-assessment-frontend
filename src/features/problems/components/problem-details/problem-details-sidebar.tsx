import {
  CalendarDays,
  CircleUserRound,
  Hash,
  Star,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { Problem } from "@/features/problems";

interface ProblemDetailsSidebarProps {
  problem: Problem;
}

export function ProblemDetailsSidebar({
  problem,
}: ProblemDetailsSidebarProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Problem Information</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Hash className="size-4 text-muted-foreground" />

            <div>
              <p className="text-xs text-muted-foreground">
                Problem ID
              </p>

              <p className="break-all text-sm font-medium">
                {problem.id}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Star className="size-4 text-muted-foreground" />

            <div>
              <p className="text-xs text-muted-foreground">
                Points
              </p>

              <p className="text-sm font-medium">
                {problem.points}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <CircleUserRound className="size-4 text-muted-foreground" />

            <div>
              <p className="text-xs text-muted-foreground">
                Created By
              </p>

              <p className="text-sm font-medium">
                {problem.createdBy?.name ??
                  "Unknown creator"}
              </p>

              {problem.createdBy?.email && (
                <p className="text-xs text-muted-foreground">
                  {problem.createdBy.email}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <CalendarDays className="size-4 text-muted-foreground" />

            <div>
              <p className="text-xs text-muted-foreground">
                Created At
              </p>

              <p className="text-sm font-medium">
                {new Date(
                  problem.createdAt,
                ).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}