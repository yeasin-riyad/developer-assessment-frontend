import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Badge,
} from "@/components/ui/badge";

import type { Problem } from "@/features/problems";

interface ProblemDetailsHeaderProps {
  problem: Problem;
}

export function ProblemDetailsHeader({
  problem,
}: ProblemDetailsHeaderProps) {
  return (
    <div className="space-y-4">
      <Button
        variant="ghost"
        className="px-0 hover:bg-transparent"
      >
        <Link href="/problems">
          <ArrowLeft className="mr-2 size-4" />
          Back to Problems
        </Link>
      </Button>

      <div className="rounded-xl border bg-card p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">
                {problem.type}
              </Badge>

              <Badge variant="outline">
                {problem.difficulty}
              </Badge>

              <Badge variant="outline">
                {problem.points} points
              </Badge>
            </div>

            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              {problem.title}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}