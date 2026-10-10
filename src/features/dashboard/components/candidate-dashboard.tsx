"use client";

import {
  Award,
  ClipboardCheck,
  Clock3,
  Trophy,
} from "lucide-react";

import type { AuthUser } from "@/features/auth";
import { useMyCandidateInvitations } from "@/features/invitations/hooks";
import { useMyCandidateAssessments } from "@/features/assessments";

import { CandidateDashboardCharts } from "@/features/admin/components/dashboard/candidate-dashboard-charts";
import { DashboardWelcome } from "./dashboard-welcome";
import { StatsCard } from "./stats-card";

interface CandidateDashboardProps {
  user: AuthUser;
}

export function CandidateDashboard({
  user,
}: CandidateDashboardProps) {
  const {
    data: invitationData,
    isLoading: invitationsLoading,
  } = useMyCandidateInvitations();

  const {
    data: attemptsData,
    isLoading: attemptsLoading,
  } = useMyCandidateAssessments();

  // Invitation API returns an array inside data.data.
  const invitations = invitationData?.data ?? [];

  // Assessment hook returns an array directly.
  const attempts = attemptsData ?? [];

  const isLoading = invitationsLoading || attemptsLoading;

  // Invitations waiting for the candidate's response.
  const availableCount = invitations.filter(
    (invitation) => invitation.status === "INVITED",
  ).length;

  const acceptedCount = invitations.filter(
    (invitation) => invitation.status === "ACCEPTED",
  ).length;

  // Actual attempt statuses from useMyCandidateAssessments().
  const inProgressCount = attempts.filter(
    (attempt) => attempt.status === "IN_PROGRESS",
  ).length;

  const completedCount = attempts.filter(
    (attempt) => attempt.status === "SUBMITTED",
  ).length;

  // Calculate average score from submitted attempts that have a score.
  const scoredAttempts = attempts.filter(
    (attempt) =>
      attempt.status === "SUBMITTED" &&
      typeof attempt.score === "number",
  );

  const averageScore =
    scoredAttempts.length > 0
      ? (
          scoredAttempts.reduce(
            (sum, attempt) => sum + attempt.score,
            0,
          ) / scoredAttempts.length
        ).toFixed(1)
      : "N/A";

  return (
    <div className="space-y-8">
      <DashboardWelcome user={user} />

      {/* Dashboard statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Available"
          value={isLoading ? "..." : availableCount.toString()}
          description="Invitations waiting for your response"
          icon={ClipboardCheck}
        />

        <StatsCard
          title="In Progress"
          value={isLoading ? "..." : inProgressCount.toString()}
          description="Assessments currently in progress"
          icon={Clock3}
        />

        <StatsCard
          title="Completed"
          value={isLoading ? "..." : completedCount.toString()}
          description="Assessments submitted"
          icon={Award}
        />

        <StatsCard
          title="Average Score"
          value={isLoading ? "..." : averageScore}
          description="Average across submitted assessments"
          icon={Trophy}
        />
      </div>

      {/* Invitation analytics */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">
            Your Assessment Analytics
          </h2>

          <p className="text-sm text-muted-foreground">
            Understand your invitation status at a glance.
          </p>
        </div>

        <CandidateDashboardCharts invitations={invitations} />
      </section>

      {/* Accepted assessments */}
      {!invitationsLoading && acceptedCount > 0 && (
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">
              Accepted Assessments
            </h2>

            <p className="text-sm text-muted-foreground">
              Assessments you have accepted and are ready to continue.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {invitations
              .filter(
                (invitation) => invitation.status === "ACCEPTED",
              )
              .slice(0, 4)
              .map((invitation) => (
                <div
                  key={invitation.id}
                  className="rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold">
                        {invitation.assessment.title}
                      </h3>

                      {invitation.assessment.description && (
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                          {invitation.assessment.description}
                        </p>
                      )}
                    </div>

                    <span className="shrink-0 rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-600">
                      Accepted
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{invitation.assessment.duration} min</span>
                    <span>•</span>
                    <span>
                      {invitation.assessment.totalMarks} marks
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* Pending invitations */}
      {!invitationsLoading && availableCount > 0 && (
        <section className="rounded-xl border bg-muted/30 p-5">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <ClipboardCheck className="size-5 text-primary" />
            </div>

            <div>
              <h2 className="font-semibold">
                You have pending invitations
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                You have{" "}
                <span className="font-medium text-foreground">
                  {availableCount}
                </span>{" "}
                assessment{" "}
                {availableCount === 1 ? "invitation" : "invitations"}{" "}
                waiting for your response.
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}