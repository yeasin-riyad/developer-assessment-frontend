"use client";

import {
  ClipboardCheck,
  Clock3,
  FileCheck,
  FileText,
} from "lucide-react";

import type { AuthUser } from "@/features/auth";

import { DashboardWelcome } from "./dashboard-welcome";
import { StatsCard } from "./stats-card";

interface EvaluatorDashboardProps {
  user: AuthUser;
}

export function EvaluatorDashboard({
  user,
}: EvaluatorDashboardProps) {
  return (
    <div className="space-y-8">
      <DashboardWelcome user={user} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Pending"
          value="—"
          description="Submissions awaiting evaluation"
          icon={Clock3}
        />

        <StatsCard
          title="Completed"
          value="—"
          description="Completed evaluations"
          icon={FileCheck}
        />

        <StatsCard
          title="Submissions"
          value="—"
          description="Total submissions"
          icon={FileText}
        />

        <StatsCard
          title="Evaluations"
          value="—"
          description="Your evaluations"
          icon={ClipboardCheck}
        />
      </div>
    </div>
  );
}