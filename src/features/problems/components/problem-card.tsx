import Link from "next/link";

import {
  ArrowRight,
  FileCode2,
  FileText,
  PenLine,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import type {
  Problem,
  ProblemDifficulty,
  ProblemType,
} from "../types";

interface ProblemCardProps {
  problem: Problem;
}

const difficultyVariant = (
  difficulty: ProblemDifficulty,
) => {
  switch (difficulty) {
    case "EASY":
      return "secondary";

    case "MEDIUM":
      return "outline";

    case "HARD":
      return "destructive";

    default:
      return "outline";
  }
};

const typeIcon = (
  type: ProblemType,
) => {
  switch (type) {
    case "CODING":
      return FileCode2;

    case "MCQ":
      return FileText;

    case "WRITTEN":
      return PenLine;

    default:
      return FileText;
  }
};

export function ProblemCard({
  problem,
}: ProblemCardProps) {
  const Icon = typeIcon(problem.type);

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="size-5" />
            </div>

            <div className="min-w-0">
              <CardTitle className="line-clamp-2 text-base">
                {problem.title}
              </CardTitle>

              <div className="mt-2 flex flex-wrap gap-2">
                <Badge variant="outline">
                  {problem.type}
                </Badge>

                <Badge
                  variant={difficultyVariant(
                    problem.difficulty,
                  )}
                >
                  {problem.difficulty}
                </Badge>

                <Badge variant="secondary">
                  {problem.points} points
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {problem.description}
        </p>

        {problem.createdBy && (
          <p className="mt-4 text-xs text-muted-foreground">
            Created by{" "}
            <span className="font-medium text-foreground">
              {problem.createdBy.name}
            </span>
          </p>
        )}

        <Button
       
          variant="ghost"
          className="mt-4 w-full justify-between"
        >
          <Link
            href={`/problems/${problem.id}`}
          >
            View problem
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}