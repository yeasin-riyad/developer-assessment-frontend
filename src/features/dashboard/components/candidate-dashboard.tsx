"use client";

import {
  Award,
  ClipboardCheck,
  Clock3,
  Trophy,
} from "lucide-react";

import type { AuthUser } from "@/features/auth";

import { DashboardWelcome } from "./dashboard-welcome";
import { StatsCard } from "./stats-card";

interface CandidateDashboardProps {
  user: AuthUser;
}

export function CandidateDashboard({
  user,
}: CandidateDashboardProps) {
  return (
    <div className="space-y-8">
      <DashboardWelcome user={user} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Available"
          value="—"
          description="Available assessments"
          icon={ClipboardCheck}
        />

        <StatsCard
          title="In Progress"
          value="—"
          description="Assessments in progress"
          icon={Clock3}
        />

        <StatsCard
          title="Completed"
          value="—"
          description="Completed assessments"
          icon={Award}
        />

        <StatsCard
          title="Average Score"
          value="—"
          description="Your average score"
          icon={Trophy}
        />
      </div>
    </div>
  );
}