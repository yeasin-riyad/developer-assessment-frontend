
"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  FilePlus2,
  FileText,
  RefreshCw,
  Users,
  UserCheck,
} from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { AuthUser } from "@/features/auth";
import { useAssessments } from "@/features/assessments";
import { useCandidates } from "@/features/candidates";

import { DashboardWelcome } from "./dashboard-welcome";
import { StatsCard } from "./stats-card";

interface RecruiterDashboardProps {
  user: AuthUser;
}

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "#94a3b8",
  PUBLISHED: "#6366f1",
  ACTIVE: "#10b981",
  CLOSED: "#f59e0b",
};

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  ACTIVE: "Active",
  CLOSED: "Closed",
};

const STATUS_ORDER = [
  "DRAFT",
  "PUBLISHED",
  "ACTIVE",
  "CLOSED",
];

function formatDate(value?: string | Date) {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getStatusColor(status: string) {
  return STATUS_COLORS[status] ?? "#94a3b8";
}

function getStatusClasses(status: string) {
  switch (status) {
    case "PUBLISHED":
      return "border-indigo-200 bg-indigo-50 text-indigo-700";
    case "ACTIVE":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "CLOSED":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "DRAFT":
    default:
      return "border-slate-200 bg-slate-50 text-slate-600";
  }
}

export function RecruiterDashboard({
  user,
}: RecruiterDashboardProps) {
  const assessmentsQuery = useAssessments();

  const candidatesQuery = useCandidates({
    page: 1,
    limit: 1,
  });

  const assessmentResponse = assessmentsQuery.data?.data;
  const candidateResponse = candidatesQuery.data?.data;

  const assessments = useMemo(() => {
    return Array.isArray(assessmentResponse)
      ? assessmentResponse
      : [];
  }, [assessmentResponse]);

  const totalAssessments = assessments.length;

  const publishedAssessments = assessments.filter(
    (assessment) => assessment.status === "PUBLISHED",
  ).length;

  const activeAssessments = assessments.filter(
    (assessment) => assessment.status === "ACTIVE",
  ).length;

  const draftAssessments = assessments.filter(
    (assessment) => assessment.status === "DRAFT",
  ).length;

  const closedAssessments = assessments.filter(
    (assessment) => assessment.status === "CLOSED",
  ).length;

  const totalCandidates =
    candidateResponse?.pagination?.total ?? 0;

  const assessmentsLoading = assessmentsQuery.isPending;
  const candidatesLoading = candidatesQuery.isPending;

  const hasError =
    assessmentsQuery.isError || candidatesQuery.isError;

  // Data for the assessment status chart.
  const statusChartData = useMemo(() => {
    return STATUS_ORDER.map((status) => ({
      status,
      name: STATUS_LABELS[status],
      count: assessments.filter(
        (assessment) => assessment.status === status,
      ).length,
    }));
  }, [assessments]);

  // Display counts by assessment status, not candidate attempts.
  const statusDistribution = useMemo(() => {
    return statusChartData.filter((item) => item.count > 0);
  }, [statusChartData]);

  // Group assessments by creation month for a simple trend chart.
  const monthlyChartData = useMemo(() => {
    const months: {
      key: string;
      month: string;
      assessments: number;
    }[] = [];

    const now = new Date();

    for (let offset = 5; offset >= 0; offset--) {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - offset,
        1,
      );

      const key = `${date.getFullYear()}-${String(
        date.getMonth() + 1,
      ).padStart(2, "0")}`;

      months.push({
        key,
        month: new Intl.DateTimeFormat("en", {
          month: "short",
        }).format(date),
        assessments: 0,
      });
    }

    const monthIndex = new Map(
      months.map((month, index) => [month.key, index]),
    );

    for (const assessment of assessments) {
      const createdAt = new Date(assessment.createdAt);

      if (Number.isNaN(createdAt.getTime())) continue;

      const key = `${createdAt.getFullYear()}-${String(
        createdAt.getMonth() + 1,
      ).padStart(2, "0")}`;

      const index = monthIndex.get(key);

      if (index !== undefined) {
        months[index].assessments += 1;
      }
    }

    return months.map(({ month, assessments: count }) => ({
      month,
      assessments: count,
    }));
  }, [assessments]);

  const recentAssessments = useMemo(() => {
    return [...assessments]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime(),
      )
      .slice(0, 5);
  }, [assessments]);

  const refreshDashboard = () => {
    void assessmentsQuery.refetch();
    void candidatesQuery.refetch();
  };

  return (
    <div className="space-y-8 pb-8">
      <DashboardWelcome user={user} />

      {/* Dashboard actions */}
      <section className="overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-blue-50 p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="max-w-xl">
            <div className="flex items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
                <Activity className="size-5" />
              </div>

              <h2 className="text-lg font-semibold text-slate-900">
                Recruiter workspace
              </h2>
            </div>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Track assessments, manage candidates, and monitor
              your recruitment workflow from one dashboard.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/assessments/create"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-medium text-white transition hover:bg-indigo-700"
            >
              <FilePlus2 className="size-4" />
              Create assessment
            </Link>

            <button
              type="button"
              onClick={refreshDashboard}
              disabled={assessmentsQuery.isFetching || candidatesQuery.isFetching}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                className={`size-4 ${
                  assessmentsQuery.isFetching ||
                  candidatesQuery.isFetching
                    ? "animate-spin"
                    : ""
                }`}
              />
              Refresh
            </button>
          </div>
        </div>
      </section>

      {/* Error message */}
      {hasError && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-sm text-red-700">
            Some dashboard data could not be loaded. Try refreshing.
          </p>

          <button
            type="button"
            onClick={refreshDashboard}
            className="inline-flex items-center gap-2 self-start text-sm font-semibold text-red-700 hover:text-red-800"
          >
            <RefreshCw className="size-4" />
            Try again
          </button>
        </div>
      )}

      {/* Statistic cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Overview
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Your assessment and candidate summary.
            </p>
          </div>

          <span className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500 sm:inline-flex">
            <CalendarDays className="size-3.5" />
            All time
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatsCard
            title="Assessments"
            value={
              assessmentsLoading
                ? "..."
                : assessmentsQuery.isError
                  ? "—"
                  : totalAssessments
            }
            description="Total assessments"
            icon={ClipboardCheck}
          />

          <StatsCard
            title="Published"
            value={
              assessmentsLoading
                ? "..."
                : assessmentsQuery.isError
                  ? "—"
                  : publishedAssessments
            }
            description="Ready for candidate invitations"
            icon={BarChart3}
          />

          <StatsCard
            title="Candidates"
            value={
              candidatesLoading
                ? "..."
                : candidatesQuery.isError
                  ? "—"
                  : totalCandidates
            }
            description="Active candidates in your scope"
            icon={Users}
          />

          <StatsCard
            title="Closed assessments"
            value={
              assessmentsLoading
                ? "..."
                : assessmentsQuery.isError
                  ? "—"
                  : closedAssessments
            }
            description="Assessments marked closed"
            icon={CheckCircle2}
          />
        </div>
      </section>

      {/* Charts */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Assessment analytics
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Understand your assessment volume and status distribution.
          </p>
        </div>

        <div className="grid gap-5 xl:grid-cols-5">
          {/* Monthly bar chart */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-3 sm:p-6">
            <div className="mb-5">
              <h3 className="font-semibold text-slate-900">
                Assessment creation
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Assessments created in the last six calendar months
              </p>
            </div>

            {assessmentsLoading ? (
              <div className="h-72 animate-pulse rounded-xl bg-slate-100" />
            ) : assessmentsQuery.isError ? (
              <div className="flex h-72 items-center justify-center text-sm text-slate-500">
                Chart data could not be loaded.
              </div>
            ) : (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyChartData}
                    margin={{
                      top: 8,
                      right: 8,
                      left: -18,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid
                      stroke="#e2e8f0"
                      strokeDasharray="4 4"
                      vertical={false}
                    />

                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 12 }}
                      dy={8}
                    />

                    <YAxis
                      allowDecimals={false}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#64748b", fontSize: 12 }}
                    />

                    <Tooltip
                      cursor={{ fill: "#eef2ff" }}
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid #e2e8f0",
                        fontSize: 12,
                      }}
                    />

                    <Bar
                      dataKey="assessments"
                      name="Assessments"
                      fill="#6366f1"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={42}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Status pie chart */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2 sm:p-6">
            <div className="mb-4">
              <h3 className="font-semibold text-slate-900">
                Assessment status
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Current distribution across all statuses
              </p>
            </div>

            {assessmentsLoading ? (
              <div className="h-56 animate-pulse rounded-xl bg-slate-100" />
            ) : assessmentsQuery.isError ? (
              <div className="flex h-56 items-center justify-center text-sm text-slate-500">
                Chart data could not be loaded.
              </div>
            ) : totalAssessments === 0 ? (
              <div className="flex h-56 flex-col items-center justify-center text-center">
                <BarChart3 className="size-8 text-slate-300" />
                <p className="mt-3 text-sm font-medium text-slate-700">
                  No assessments yet
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Create an assessment to see its status here.
                </p>
              </div>
            ) : (
              <>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusDistribution}
                        dataKey="count"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={58}
                        outerRadius={88}
                        paddingAngle={3}
                        stroke="white"
                        strokeWidth={3}
                      >
                        {statusDistribution.map((entry) => (
                          <Cell
                            key={entry.status}
                            fill={getStatusColor(entry.status)}
                          />
                        ))}
                      </Pie>

                      <Tooltip
                        formatter={(value, name) => [
                          value,
                          name,
                        ]}
                        contentStyle={{
                          borderRadius: 12,
                          border: "1px solid #e2e8f0",
                          fontSize: 12,
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-2 space-y-3">
                  {statusChartData.map((item) => (
                    <div
                      key={item.status}
                      className="flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="size-2.5 rounded-full"
                          style={{
                            backgroundColor: getStatusColor(
                              item.status,
                            ),
                          }}
                        />
                        <span className="text-sm text-slate-600">
                          {item.name}
                        </span>
                      </div>

                      <span className="text-sm font-semibold tabular-nums text-slate-900">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Assessment status bars */}
      <section className="grid gap-5 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6 flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-slate-900">
                Status breakdown
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Assessment counts by status
              </p>
            </div>

            <BarChart3 className="size-5 text-indigo-500" />
          </div>

          {assessmentsLoading ? (
            <div className="h-48 animate-pulse rounded-xl bg-slate-100" />
          ) : assessmentsQuery.isError ? (
            <p className="py-12 text-center text-sm text-slate-500">
              Status data could not be loaded.
            </p>
          ) : (
            <div className="space-y-5">
              {statusChartData.map((item) => {
                const percentage =
                  totalAssessments > 0
                    ? (item.count / totalAssessments) * 100
                    : 0;

                return (
                  <div key={item.status}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="text-sm font-medium text-slate-700">
                        {item.name}
                      </span>

                      <span className="text-sm tabular-nums text-slate-500">
                        {item.count}
                        <span className="ml-1 text-xs">
                          ({percentage.toFixed(0)}%)
                        </span>
                      </span>
                    </div>

                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: getStatusColor(
                            item.status,
                          ),
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Workflow overview */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-6">
            <h3 className="font-semibold text-slate-900">
              Workflow overview
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              A quick look at your assessment pipeline
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-slate-500">
                <FileText className="size-4" />
                <span className="text-xs font-medium">
                  Drafts
                </span>
              </div>
              <p className="mt-3 text-2xl font-bold text-slate-900">
                {assessmentsLoading || assessmentsQuery.isError
                  ? "—"
                  : draftAssessments}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                In progress
              </p>
            </div>

            <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-4">
              <div className="flex items-center gap-2 text-emerald-700">
                <Activity className="size-4" />
                <span className="text-xs font-medium">
                  Active
                </span>
              </div>
              <p className="mt-3 text-2xl font-bold text-slate-900">
                {assessmentsLoading || assessmentsQuery.isError
                  ? "—"
                  : activeAssessments}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Currently active
              </p>
            </div>

            <div className="rounded-xl border border-indigo-100 bg-indigo-50/70 p-4">
              <div className="flex items-center gap-2 text-indigo-700">
                <CheckCircle2 className="size-4" />
                <span className="text-xs font-medium">
                  Published
                </span>
              </div>
              <p className="mt-3 text-2xl font-bold text-slate-900">
                {assessmentsLoading || assessmentsQuery.isError
                  ? "—"
                  : publishedAssessments}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Published assessments
              </p>
            </div>

            <div className="rounded-xl border border-amber-100 bg-amber-50/70 p-4">
              <div className="flex items-center gap-2 text-amber-700">
                <Users className="size-4" />
                <span className="text-xs font-medium">
                  Candidates
                </span>
              </div>
              <p className="mt-3 text-2xl font-bold text-slate-900">
                {candidatesLoading || candidatesQuery.isError
                  ? "—"
                  : totalCandidates}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Active candidates
              </p>
            </div>
          </div>

          <Link
            href="/assessments"
            className="mt-5 flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50/50 hover:text-indigo-700"
          >
            Review assessment workflow
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* Recent assessments */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h3 className="font-semibold text-slate-900">
              Recent assessments
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Your five most recently created assessments
            </p>
          </div>

          <Link
            href="/assessments"
            className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            View all assessments
            <ArrowRight className="size-4" />
          </Link>
        </div>

        {assessmentsLoading ? (
          <div className="space-y-3 p-5">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-14 animate-pulse rounded-xl bg-slate-100"
              />
            ))}
          </div>
        ) : assessmentsQuery.isError ? (
          <div className="px-6 py-12 text-center text-sm text-slate-500">
            Unable to load recent assessments.
          </div>
        ) : recentAssessments.length === 0 ? (
          <div className="flex flex-col items-center px-6 py-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <FilePlus2 className="size-6" />
            </div>

            <p className="mt-4 font-medium text-slate-900">
              Create your first assessment
            </p>

            <p className="mt-1 max-w-sm text-sm text-slate-500">
              Your recently created assessments will appear here.
            </p>

            <Link
              href="/assessments/create"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
            >
              <FilePlus2 className="size-4" />
              Create assessment
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left">
                <thead className="bg-slate-50/80">
                  <tr className="border-b border-slate-100">
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Assessment
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Created
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {recentAssessments.map((assessment) => (
                    <tr
                      key={assessment.id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">
                          {assessment.title}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          {assessment.description || "No description"}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${
                            getStatusClasses(assessment.status)
                          }`}
                        >
                          {STATUS_LABELS[assessment.status] ??
                            assessment.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {assessment.duration} min
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {formatDate(assessment.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="divide-y divide-slate-100 md:hidden">
              {recentAssessments.map((assessment) => (
                <div key={assessment.id} className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="break-words text-sm font-semibold text-slate-900">
                        {assessment.title}
                      </p>
                      <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                        {assessment.description || "No description"}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full border px-2 py-1 text-xs font-medium ${
                        getStatusClasses(assessment.status)
                      }`}
                    >
                      {STATUS_LABELS[assessment.status] ??
                        assessment.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{assessment.duration} min</span>
                    <span>{formatDate(assessment.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Quick links */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Quick access
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Get to the pages you use most often.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <QuickLink
            href="/assessments/create"
            icon={FilePlus2}
            title="Create assessment"
            description="Create and prepare a new assessment."
          />

          <QuickLink
            href="/assessments"
            icon={ClipboardCheck}
            title="Manage assessments"
            description="View drafts, published, active, and closed assessments."
          />

          <QuickLink
            href="/candidates"
            icon={UserCheck}
            title="Candidates"
            description="Browse candidates and manage your recruitment workflow."
          />
        </div>
      </section>
    </div>
  );
}

function QuickLink({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: typeof FileText;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
    >
      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-100">
        <Icon className="size-5" />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-700">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-5 text-slate-500">
          {description}
        </p>
      </div>

      <ArrowRight className="mt-1 size-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-indigo-600" />
    </Link>
  );
}
