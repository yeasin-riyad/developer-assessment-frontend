"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

import {
  Activity,
  ChartColumnIncreasing,
  CircleCheck,
  FileText,
  Users,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import type { AdminStatistics } from "../../types/admin.types";

interface AdminDashboardChartsProps {
  stats: AdminStatistics;
}

const userChartConfig = {
  candidates: {
    label: "Candidates",
    color: "var(--chart-1)",
  },
  recruiters: {
    label: "Recruiters",
    color: "var(--chart-2)",
  },
  creators: {
    label: "Creators",
    color: "var(--chart-3)",
  },
  evaluators: {
    label: "Evaluators",
    color: "var(--chart-4)",
  },
  admins: {
    label: "Admins",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

const assessmentChartConfig = {
  draft: {
    label: "Draft",
    color: "var(--chart-1)",
  },
  published: {
    label: "Published",
    color: "var(--chart-2)",
  },
  active: {
    label: "Active",
    color: "var(--chart-3)",
  },
  closed: {
    label: "Closed",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

const activityChartConfig = {
  count: {
    label: "Count",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const problemChartConfig = {
  mcq: {
    label: "Multiple choice",
    color: "var(--chart-1)",
  },
  written: {
    label: "Written",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

function formatNumber(value: number) {
  return new Intl.NumberFormat().format(value);
}

export function AdminDashboardCharts({ stats }: AdminDashboardChartsProps) {
  const userData = [
    {
      role: "Candidates",
      count: stats.users.candidates,
      fill: "var(--color-candidates)",
    },
    {
      role: "Recruiters",
      count: stats.users.recruiters,
      fill: "var(--color-recruiters)",
    },
    {
      role: "Creators",
      count: stats.users.creators,
      fill: "var(--color-creators)",
    },
    {
      role: "Evaluators",
      count: stats.users.evaluators,
      fill: "var(--color-evaluators)",
    },
    {
      role: "Admins",
      count: stats.users.admins,
      fill: "var(--color-admins)",
    },
  ];

  const assessmentData = [
    {
      status: "draft",
      count: stats.assessments.draft,
      fill: "var(--color-draft)",
    },
    {
      status: "published",
      count: stats.assessments.published,
      fill: "var(--color-published)",
    },
    {
      status: "active",
      count: stats.assessments.active,
      fill: "var(--color-active)",
    },
    {
      status: "closed",
      count: stats.assessments.closed,
      fill: "var(--color-closed)",
    },
  ];

  const activityData = [
    {
      activity: "Invitations",
      count: stats.activity.totalInvitations,
    },
    {
      activity: "Attempts",
      count: stats.activity.totalAttempts,
    },
    {
      activity: "Submissions",
      count: stats.activity.totalSubmissions,
    },
    {
      activity: "Evaluations",
      count: stats.activity.totalEvaluations,
    },
  ];

  const problemData = [
    {
      type: "mcq",
      count: stats.problems.mcq,
      fill: "var(--color-mcq)",
    },
    {
      type: "written",
      count: stats.problems.written,
      fill: "var(--color-written)",
    },
  ];

  const hasUsers = userData.some((item) => item.count > 0);
  const hasAssessments = assessmentData.some((item) => item.count > 0);
  const hasActivity = activityData.some((item) => item.count > 0);
  const hasProblems = problemData.some((item) => item.count > 0);

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      {/* Users by role */}{" "}
      <Card className="min-w-0 border-border/60 shadow-sm">
        {" "}
        <CardHeader>
          {" "}
          <div className="flex items-center gap-3">
            {" "}
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
              {" "}
              <Users className="size-5" />{" "}
            </div>
            <div>
              <CardTitle>Users by role</CardTitle>
              <CardDescription>
                Distribution of registered platform users
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {hasUsers ? (
            <ChartContainer
              config={userChartConfig}
              className="h-[280px] w-full"
            >
              <BarChart
                data={userData}
                accessibilityLayer
                margin={{
                  top: 12,
                  right: 12,
                  left: -16,
                  bottom: 4,
                }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />

                <XAxis
                  dataKey="role"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  interval={0}
                  tick={{ fontSize: 11 }}
                />

                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  allowDecimals={false}
                  tickFormatter={(value) => formatNumber(Number(value))}
                />

                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />

                <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={48}>
                  {userData.map((item) => (
                    <Cell key={item.role} fill={item.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          ) : (
            <ChartEmptyState message="No user data available yet." />
          )}
        </CardContent>
      </Card>
      {/* Assessment status */}
      <Card className="min-w-0 border-border/60 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600">
              <ChartColumnIncreasing className="size-5" />
            </div>

            <div>
              <CardTitle>Assessment status</CardTitle>
              <CardDescription>
                Current breakdown of all assessments
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {hasAssessments ? (
            <ChartContainer
              config={assessmentChartConfig}
              className="mx-auto h-[280px] w-full"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />

                <Pie
                  data={assessmentData}
                  dataKey="count"
                  nameKey="status"
                  innerRadius={66}
                  outerRadius={100}
                  paddingAngle={3}
                  strokeWidth={4}
                  stroke="var(--background)"
                >
                  {assessmentData.map((item) => (
                    <Cell key={item.status} fill={item.fill} />
                  ))}

                  <Label
                    content={({ viewBox }) => {
                      if (
                        !viewBox ||
                        !("cx" in viewBox) ||
                        !("cy" in viewBox) ||
                        typeof viewBox.cx !== "number" ||
                        typeof viewBox.cy !== "number"
                      ) {
                        return null;
                      }

                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-2xl font-bold"
                          >
                            {formatNumber(stats.assessments.total)}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy + 22}
                            className="fill-muted-foreground text-xs"
                          >
                            Total
                          </tspan>
                        </text>
                      );
                    }}
                  />
                </Pie>

                <ChartLegend
                  content={<ChartLegendContent nameKey="status" />}
                  verticalAlign="bottom"
                />
              </PieChart>
            </ChartContainer>
          ) : (
            <ChartEmptyState message="No assessment data available yet." />
          )}
        </CardContent>
      </Card>
      {/* Platform activity */}
      <Card className="min-w-0 border-border/60 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <Activity className="size-5" />
            </div>

            <div>
              <CardTitle>Platform activity</CardTitle>
              <CardDescription>
                Total recorded activity across the platform
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {hasActivity ? (
            <ChartContainer
              config={activityChartConfig}
              className="h-[280px] w-full"
            >
              <BarChart
                data={activityData}
                layout="vertical"
                accessibilityLayer
                margin={{
                  top: 8,
                  right: 24,
                  left: 8,
                  bottom: 8,
                }}
              >
                <CartesianGrid horizontal={false} />

                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />

                <YAxis
                  type="category"
                  dataKey="activity"
                  tickLine={false}
                  axisLine={false}
                  width={88}
                  tick={{ fontSize: 11 }}
                />

                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />

                <Bar
                  dataKey="count"
                  fill="var(--color-count)"
                  radius={[0, 6, 6, 0]}
                  maxBarSize={32}
                />
              </BarChart>
            </ChartContainer>
          ) : (
            <ChartEmptyState message="No platform activity recorded yet." />
          )}
        </CardContent>
      </Card>
      {/* Problem types */}
      <Card className="min-w-0 border-border/60 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600">
              <FileText className="size-5" />
            </div>

            <div>
              <CardTitle>Problem types</CardTitle>
              <CardDescription>
                MCQ and written problems in the platform
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {hasProblems ? (
            <ChartContainer
              config={problemChartConfig}
              className="mx-auto h-[280px] w-full"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />

                <Pie
                  data={problemData}
                  dataKey="count"
                  nameKey="type"
                  innerRadius={62}
                  outerRadius={94}
                  paddingAngle={4}
                  strokeWidth={4}
                  stroke="var(--background)"
                >
                  {problemData.map((item) => (
                    <Cell key={item.type} fill={item.fill} />
                  ))}
                </Pie>

                <ChartLegend
                  content={<ChartLegendContent nameKey="type" />}
                  verticalAlign="bottom"
                />
              </PieChart>
            </ChartContainer>
          ) : (
            <ChartEmptyState message="No problems available yet." />
          )}
        </CardContent>
      </Card>
      {/* Results summary */}
      <Card className="border-border/60 shadow-sm xl:col-span-2">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600">
              <CircleCheck className="size-5" />
            </div>

            <div>
              <CardTitle>Assessment results</CardTitle>
              <CardDescription>Overall pass and fail breakdown</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-muted/50 p-5">
              <p className="text-sm text-muted-foreground">Total results</p>
              <p className="mt-2 text-2xl font-bold">
                {formatNumber(stats.results.total)}
              </p>
            </div>

            <div className="rounded-xl bg-emerald-500/10 p-5">
              <p className="text-sm text-emerald-700">Passed</p>
              <p className="mt-2 text-2xl font-bold text-emerald-700">
                {formatNumber(stats.results.passed)}
              </p>
            </div>

            <div className="rounded-xl bg-red-500/10 p-5">
              <p className="text-sm text-red-700">Failed</p>
              <p className="mt-2 text-2xl font-bold text-red-700">
                {formatNumber(stats.results.failed)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ChartEmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-[280px] items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
      {message}{" "}
    </div>
  );
}
