"use client";

import {
  BarChart3,
  ClipboardCheck,
  UserCheck,
  Users,
} from "lucide-react";

import type { AuthUser } from "@/features/auth";

import { DashboardWelcome } from "./dashboard-welcome";
import { StatsCard } from "./stats-card";

interface RecruiterDashboardProps {
  user: AuthUser;
}

export function RecruiterDashboard({
  user,
}: RecruiterDashboardProps) {
  return (
    <div className="space-y-8">
      <DashboardWelcome user={user} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Assessments"
          value="—"
          description="Your assessments"
          icon={ClipboardCheck}
        />

        <StatsCard
          title="Published"
          value="—"
          description="Published assessments"
          icon={BarChart3}
        />

        <StatsCard
          title="Candidates"
          value="—"
          description="Candidates in your assessments"
          icon={Users}
        />

        <StatsCard
          title="Completed"
          value="—"
          description="Completed candidate attempts"
          icon={UserCheck}
        />
      </div>
    </div>
  );
}