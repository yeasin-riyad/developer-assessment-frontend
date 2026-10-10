
"use client";

import {
  ClipboardCheck,
  FileCheck,
  FileText,
  Library,
  RefreshCw,
} from "lucide-react";

import type { AuthUser } from "@/features/auth";
import { useCreatorDashboardStatistics } from "@/features/creator/useCreator";

import { DashboardWelcome } from "./dashboard-welcome";
import { StatsCard } from "./stats-card";
import { CreatorDashboardCharts } from "./CreatorDashboardCharts";

interface CreatorDashboardProps {
  user: AuthUser;
}

export function CreatorDashboard({
  user,
}: CreatorDashboardProps) {
  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useCreatorDashboardStatistics();

  const statistics = response?.data;

  const cards = [
    {
      title: "Total Problems",
      value: statistics?.problems.total,
      description: "Problems in your bank",
      icon: Library,
    },
    {
      title: "MCQ Problems",
      value: statistics?.problems.mcq,
      description: "Multiple-choice problems",
      icon: FileCheck,
    },
    {
      title: "Written Problems",
      value: statistics?.problems.written,
      description: "Written-response problems",
      icon: FileText,
    },
    {
      title: "Assessments",
      value: statistics?.assessments.total,
      description: "Assessments using your problems",
      icon: ClipboardCheck,
    },
  ];

  return (
    <div className="space-y-8">
      <DashboardWelcome user={user} />

      {/* Statistics cards */}
      {isError ? (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <h2 className="font-semibold">
              Unable to load dashboard statistics
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {error instanceof Error
                ? error.message
                : "Something went wrong. Please try again."}
            </p>
          </div>

          <button
            type="button"
            onClick={() => void refetch()}
            disabled={isFetching}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-md border px-3 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50"
          >
            <RefreshCw
              className={`size-4 ${
                isFetching ? "animate-spin" : ""
              }`}
            />
            Retry
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <StatsCard
              key={card.title}
              title={card.title}
              value={
                isLoading
                  ? "..."
                  : String(card.value ?? 0)
              }
              description={card.description}
              icon={card.icon}
            />
          ))}
        </div>
      )}

      {/* Analytics charts */}
      {!isLoading && !isError && statistics && (
        <CreatorDashboardCharts statistics={statistics} />
      )}
    </div>
  );
}

