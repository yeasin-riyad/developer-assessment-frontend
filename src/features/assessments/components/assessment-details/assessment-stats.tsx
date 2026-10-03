import {
  Clock3,
  FileQuestion,
  Trophy,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface AssessmentStatsProps {
  assessment: {
    duration: number;
    totalMarks: number;
    problems?: unknown[];
  };
}

export function AssessmentStats({
  assessment,
}: AssessmentStatsProps) {
  const stats = [
    {
      label: "Duration",
      value: `${assessment.duration} min`,
      icon: Clock3,
    },
    {
      label: "Total Marks",
      value: assessment.totalMarks,
      icon: Trophy,
    },
    {
      label: "Problems",
      value: assessment.problems?.length ?? 0,
      icon: FileQuestion,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-lg bg-primary/10 p-3">
                <Icon className="size-5 text-primary" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  {stat.label}
                </p>

                <p className="text-2xl font-semibold">
                  {stat.value}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}