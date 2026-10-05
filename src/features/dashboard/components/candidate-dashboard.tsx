
"use client";

import {
  Award,
  ClipboardCheck,
  Clock3,
  Trophy,
} from "lucide-react";

import type { AuthUser } from "@/features/auth";

import { useMyCandidateInvitations } from "@/features/invitations/hooks";

import { DashboardWelcome } from "./dashboard-welcome";
import { StatsCard } from "./stats-card";

interface CandidateDashboardProps {
  user: AuthUser;
}

export function CandidateDashboard({
  user,
}: CandidateDashboardProps) {
  const {
    data,
    isLoading,
  } = useMyCandidateInvitations();

  const invitations = data?.data ?? [];

  /**
   * Invitations that are currently waiting
   * for the candidate's response.
   */
  const availableCount = invitations.filter(
    (invitation) =>
      invitation.status === "INVITED",
  ).length;

  /**
   * Accepted invitations.
   *
   * These represent assessments that the candidate
   * has accepted and therefore should have an Attempt.
   *
   * We keep this separate from "In Progress" because
   * the current invitation API does not expose Attempt
   * status.
   */
  const acceptedCount = invitations.filter(
    (invitation) =>
      invitation.status === "ACCEPTED",
  ).length;

  /**
   * Until the Attempt API is implemented, we cannot
   * accurately determine:
   *
   * - In Progress
   * - Completed
   * - Average Score
   */
  const inProgressCount = "—";
  const completedCount = "—";
  const averageScore = "—";

  return (
    <div className="space-y-8">
      <DashboardWelcome user={user} />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Available"
          value={
            isLoading
              ? "..."
              : availableCount.toString()
          }
          description={
            availableCount === 1
              ? "Assessment invitation waiting"
              : "Assessment invitations waiting"
          }
          icon={ClipboardCheck}
        />

        <StatsCard
          title="In Progress"
          value={inProgressCount}
          description="Assessments in progress"
          icon={Clock3}
        />

        <StatsCard
          title="Completed"
          value={completedCount}
          description="Completed assessments"
          icon={Award}
        />

        <StatsCard
          title="Average Score"
          value={averageScore}
          description="Your average score"
          icon={Trophy}
        />
      </div>

      {/* Accepted assessments */}
      {!isLoading && acceptedCount > 0 && (
        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">
              Accepted Assessments
            </h2>

            <p className="text-sm text-muted-foreground">
              Assessments you have accepted and are
              ready to continue.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {invitations
              .filter(
                (invitation) =>
                  invitation.status === "ACCEPTED",
              )
              .slice(0, 4)
              .map((invitation) => (
                <div
                  key={invitation.id}
                  className="
                    rounded-xl
                    border
                    bg-card
                    p-5
                    shadow-sm
                    transition-shadow
                    hover:shadow-md
                  "
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold">
                        {invitation.assessment.title}
                      </h3>

                      {invitation.assessment
                        .description && (
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                          {
                            invitation.assessment
                              .description
                          }
                        </p>
                      )}
                    </div>

                    <span
                      className="
                        shrink-0
                        rounded-full
                        bg-green-500/10
                        px-2.5
                        py-1
                        text-xs
                        font-medium
                        text-green-600
                      "
                    >
                      Accepted
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                    <span>
                      {invitation.assessment.duration}{" "}
                      min
                    </span>

                    <span>•</span>

                    <span>
                      {invitation.assessment.totalMarks}{" "}
                      marks
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* Pending invitations */}
      {!isLoading && availableCount > 0 && (
        <section className="rounded-xl border bg-muted/30 p-5">
          <div className="flex items-start gap-3">
            <div
              className="
                flex
                size-10
                shrink-0
                items-center
                justify-center
                rounded-lg
                bg-primary/10
              "
            >
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
                {availableCount === 1
                  ? "invitation"
                  : "invitations"}{" "}
                waiting for your response.
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

