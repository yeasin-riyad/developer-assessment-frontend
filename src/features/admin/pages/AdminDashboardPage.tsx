"use client";

import Link from "next/link";
import {
Activity,
ArrowDownRight,
ArrowRight,
ArrowUpRight,
Building2,
ClipboardCheck,
FileText,
RefreshCw,
ShieldCheck,
Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
Card,
CardContent,
} from "@/components/ui/card";

import { useAdminStatistics } from "../hooks/useAdmin";
import { AdminDashboardCharts } from "../components/dashboard/AdminDashboardCharts";

function formatNumber(value: number) {
return new Intl.NumberFormat().format(value);
}

function DashboardLoading() {
return ( <div className="space-y-8"> <div className="h-10 w-64 animate-pulse rounded-lg bg-muted" /> <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
{Array.from({ length: 8 }).map((_, index) => ( <div
         key={index}
         className="h-32 animate-pulse rounded-xl border bg-muted/40"
       />
))} </div> <div className="grid gap-6 xl:grid-cols-2">
{Array.from({ length: 4 }).map((_, index) => ( <div
         key={index}
         className="h-[380px] animate-pulse rounded-xl border bg-muted/40"
       />
))} </div> </div>
);
}

function DashboardError({
message,
onRetry,
isRetrying,
}: {
message: string;
onRetry: () => void;
isRetrying: boolean;
}) {
return ( <Card className="border-destructive/30"> <CardContent className="flex flex-col items-center gap-4 py-12 text-center"> <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive"> <Activity className="size-7" /> </div>


    <div>
      <h2 className="font-semibold">
        Could not load dashboard
      </h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {message}
      </p>
    </div>

    <Button
      onClick={onRetry}
      disabled={isRetrying}
      variant="outline"
    >
      <RefreshCw
        className={`mr-2 size-4 ${isRetrying ? "animate-spin" : ""}`}
      />
      Try again
    </Button>
  </CardContent>
</Card>


);
}

function StatCard({
title,
value,
description,
icon: Icon,
iconClassName,
href,
}: {
title: string;
value: number;
description: string;
icon: React.ElementType;
iconClassName: string;
href?: string;
}) {
const content = ( <Card className="h-full border-border/60 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"> <CardContent className="p-5"> <div className="flex items-start justify-between gap-3"> <div className="min-w-0"> <p className="text-sm font-medium text-muted-foreground">
{title} </p> <p className="mt-3 text-3xl font-bold tracking-tight">
{formatNumber(value)} </p> <p className="mt-2 text-xs text-muted-foreground">
{description} </p> </div>


      <div
        className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}
      >
        <Icon className="size-5" />
      </div>
    </div>

    {href && (
      <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-primary">
        View details
        <ArrowRight className="size-3.5" />
      </div>
    )}
  </CardContent>
</Card>


);

return href ? ( <Link href={href} className="block">
{content} </Link>
) : (
content
);
}

export function AdminDashboardPage() {
const {
data,
isLoading,
isError,
error,
refetch,
isFetching,
} = useAdminStatistics();

const stats = data?.data;

if (isLoading) {
return <DashboardLoading />;
}

if (isError || !stats) {
return (
<DashboardError
message={
error instanceof Error
? error.message
: "Please check your connection and try again."
}
onRetry={() => {
void refetch();
}}
isRetrying={isFetching}
/>
);
}

const totalPeople =
stats.users.candidates +
stats.users.recruiters +
stats.users.creators +
stats.users.evaluators +
stats.users.admins;

const passRate =
stats.results.total > 0
? (stats.results.passed / stats.results.total) * 100
: 0;

return ( <div className="min-w-0 space-y-8 pb-8">
{/* Header */} <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"> <div> <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground"> <ShieldCheck className="size-4 text-primary" />
Platform administration </div>


      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        Admin Dashboard
      </h1>

      <p className="mt-2 text-sm text-muted-foreground">
        Your platform at a glance. Monitor users, assessments,
        and evaluation activity.
      </p>
    </div>

    <Button
      variant="outline"
      onClick={() => {
        void refetch();
      }}
      disabled={isFetching}
      className="w-fit"
    >
      <RefreshCw
        className={`mr-2 size-4 ${isFetching ? "animate-spin" : ""}`}
      />
      Refresh data
    </Button>
  </div>

  {/* Primary KPIs */}
  <section>
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-base font-semibold">
        Platform overview
      </h2>
      <span className="text-xs text-muted-foreground">
        Current totals
      </span>
    </div>

    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Total users"
        value={stats.users.total}
        description={`${formatNumber(totalPeople)} across all roles`}
        icon={Users}
        iconClassName="bg-blue-500/10 text-blue-600"
        href="/dashboard/users"
      />

      <StatCard
        title="Companies"
        value={stats.companies.total}
        description={`${formatNumber(stats.companies.active)} active organizations`}
        icon={Building2}
        iconClassName="bg-violet-500/10 text-violet-600"
        href="/dashboard/companies"
      />

      <StatCard
        title="Assessments"
        value={stats.assessments.total}
        description={`${formatNumber(stats.assessments.active)} currently active`}
        icon={ClipboardCheck}
        iconClassName="bg-emerald-500/10 text-emerald-600"
        href="/dashboard/assessments"
      />

      <StatCard
        title="Total problems"
        value={stats.problems.total}
        description={`${formatNumber(stats.problems.mcq)} MCQ · ${formatNumber(stats.problems.written)} written`}
        icon={FileText}
        iconClassName="bg-amber-500/10 text-amber-600"
        href="/dashboard/problems"
      />
    </div>
  </section>

  {/* Assessment KPIs */}
  <section>
    <h2 className="mb-4 text-base font-semibold">
      Assessment activity
    </h2>

    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Invitations sent"
        value={stats.activity.totalInvitations}
        description="Total recorded invitations"
        icon={ArrowUpRight}
        iconClassName="bg-sky-500/10 text-sky-600"
      />

      <StatCard
        title="Assessment attempts"
        value={stats.activity.totalAttempts}
        description="Total recorded attempts"
        icon={Activity}
        iconClassName="bg-indigo-500/10 text-indigo-600"
      />

      <StatCard
        title="Submissions"
        value={stats.activity.totalSubmissions}
        description="Answers submitted"
        icon={FileText}
        iconClassName="bg-orange-500/10 text-orange-600"
      />

      <StatCard
        title="Evaluations"
        value={stats.activity.totalEvaluations}
        description="Recorded evaluation activity"
        icon={ClipboardCheck}
        iconClassName="bg-teal-500/10 text-teal-600"
      />
    </div>
  </section>

  {/* Charts */}
  <section>
    <div className="mb-4">
      <h2 className="text-base font-semibold">
        Analytics and insights
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Understand the composition and activity of your platform.
      </p>
    </div>

    <AdminDashboardCharts stats={stats} />
  </section>

  {/* Results summary */}
  <section>
    <div className="mb-4">
      <h2 className="text-base font-semibold">
        Assessment outcomes
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Summary of the results currently recorded on the platform.
      </p>
    </div>

    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="border-border/60 shadow-sm">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ClipboardCheck className="size-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              Total results
            </p>
            <p className="mt-1 text-2xl font-bold">
              {formatNumber(stats.results.total)}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-emerald-500/20 shadow-sm">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
            <ArrowUpRight className="size-6" />
          </div>
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">
              Passed
            </p>
            <p className="mt-1 text-2xl font-bold text-emerald-600">
              {formatNumber(stats.results.passed)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {passRate.toFixed(1)}% of recorded results
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-500/20 shadow-sm">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="flex size-12 items-center justify-center rounded-xl bg-red-500/10 text-red-600">
            <ArrowDownRight className="size-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              Failed
            </p>
            <p className="mt-1 text-2xl font-bold text-red-600">
              {formatNumber(stats.results.failed)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {stats.results.total > 0
                ? `${((stats.results.failed / stats.results.total) * 100).toFixed(1)}% of recorded results`
                : "No results recorded yet"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  </section>

  {/* Quick actions */}
  <section>
    <h2 className="mb-4 text-base font-semibold">
      Quick actions
    </h2>

    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {[
        {
          title: "Manage users",
          description: "Roles and account access",
          href: "/dashboard/users",
          icon: Users,
        },
        {
          title: "Manage companies",
          description: "Organization status",
          href: "/dashboard/companies",
          icon: Building2,
        },
        {
          title: "Manage problems",
          description: "MCQ and written questions",
          href: "/dashboard/problems",
          icon: FileText,
        },
        {
          title: "Manage assessments",
          description: "Review and close assessments",
          href: "/dashboard/assessments",
          icon: ClipboardCheck,
        },
      ].map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="group flex items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-muted/50"
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <item.icon className="size-5" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">
              {item.title}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {item.description}
            </p>
          </div>

          <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
        </Link>
      ))}
    </div>
  </section>
</div>


);
}
