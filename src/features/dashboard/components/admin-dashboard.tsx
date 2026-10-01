"use client";

import {
  Building2,
  ClipboardCheck,
  FileText,
  Users,
} from "lucide-react";

import type { AuthUser } from "@/features/auth";

import { DashboardWelcome } from "./dashboard-welcome";
import { StatsCard } from "./stats-card";

interface AdminDashboardProps {
  user: AuthUser;
}

export function AdminDashboard({
  user,
}: AdminDashboardProps) {
  return (
    <div className="space-y-8">
      <DashboardWelcome user={user} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Users"
          value="—"
          description="Registered users"
          icon={Users}
        />

        <StatsCard
          title="Companies"
          value="—"
          description="Registered companies"
          icon={Building2}
        />

        <StatsCard
          title="Assessments"
          value="—"
          description="Platform assessments"
          icon={ClipboardCheck}
        />

        <StatsCard
          title="Problems"
          value="—"
          description="Platform problems"
          icon={FileText}
        />
      </div>
    </div>
  );
}