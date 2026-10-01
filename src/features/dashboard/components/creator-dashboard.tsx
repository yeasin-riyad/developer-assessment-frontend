"use client";

import {
  ClipboardCheck,
  FileText,
  FileCheck,
  Library,
} from "lucide-react";

import type { AuthUser } from "@/features/auth";

import { DashboardWelcome } from "./dashboard-welcome";
import { StatsCard } from "./stats-card";

interface CreatorDashboardProps {
  user: AuthUser;
}

export function CreatorDashboard({
  user,
}: CreatorDashboardProps) {
  return (
    <div className="space-y-8">
      <DashboardWelcome user={user} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Problems"
          value="—"
          description="Problems in your bank"
          icon={Library}
        />

        <StatsCard
          title="Published"
          value="—"
          description="Published problems"
          icon={FileCheck}
        />

        <StatsCard
          title="Drafts"
          value="—"
          description="Draft problems"
          icon={FileText}
        />

        <StatsCard
          title="Assessments"
          value="—"
          description="Assessments using your problems"
          icon={ClipboardCheck}
        />
      </div>
    </div>
  );
}