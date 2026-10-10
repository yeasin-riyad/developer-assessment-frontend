
"use client";

import {
  Activity,
  BarChart3,
  ChartPie,
  ClipboardCheck,
  FileText,
} from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { CreatorDashboardStatistics } from "@/features/creator/types";


interface CreatorDashboardChartsProps {
  statistics: CreatorDashboardStatistics;
}

const chartColors = {
  mcq: "var(--chart-1)",
  written: "var(--chart-2)",
  coding: "var(--chart-3)",
};

const problemChartConfig = {
  count: {
    label: "Problems",
  },
} satisfies ChartConfig;

const problemTypeConfig = {
  mcq: {
    label: "MCQ",
    color: chartColors.mcq,
  },
  written: {
    label: "Written",
    color: chartColors.written,
  },
  coding: {
    label: "Coding",
    color: chartColors.coding,
  },
} satisfies ChartConfig;

export function CreatorDashboardCharts({
  statistics,
}: CreatorDashboardChartsProps) {
  const problemData = [
    {
      type: "MCQ",
      key: "mcq",
      count: statistics.problems.mcq,
      fill: chartColors.mcq,
    },
    {
      type: "Written",
      key: "written",
      count: statistics.problems.written,
      fill: chartColors.written,
    },
    {
      type: "Coding",
      key: "coding",
      count: statistics.problems.coding,
      fill: chartColors.coding,
    },
  ].filter((item) => item.count > 0);

  const totalProblems = statistics.problems.total;
  const totalAssessments = statistics.assessments.total;

  const hasProblems = totalProblems > 0;

  return (
    <section className="space-y-4">
      {/* Analytics heading */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">
            Problem Analytics
          </h2>
          <p className="text-sm text-muted-foreground">
            Explore your problem bank and assessment usage.
          </p>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-xs text-muted-foreground">
          <Activity className="size-3.5 text-primary" />
          Live statistics
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-4 xl:grid-cols-2">
        {/* Problem distribution donut chart */}
        <Card className="overflow-hidden">
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <CardTitle className="text-base">
                  Problem Distribution
                </CardTitle>
                <CardDescription>
                  Breakdown by problem type
                </CardDescription>
              </div>

              <div className="rounded-lg bg-primary/10 p-2">
                <ChartPie className="size-5 text-primary" />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {!hasProblems ? (
              <div className="flex h-[260px] flex-col items-center justify-center text-center">
                <FileText className="mb-3 size-10 text-muted-foreground/50" />
                <p className="font-medium">No problems yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Create your first problem to see the distribution.
                </p>
              </div>
            ) : (
              <div className="grid items-center gap-4 sm:grid-cols-2">
                <ChartContainer
                  config={problemChartConfig}
                  className="mx-auto h-[240px] w-full max-w-[280px]"
                >
                  <PieChart accessibilityLayer>
                    <ChartTooltip
                      content={<ChartTooltipContent hideLabel />}
                    />

                    <Pie
                      data={problemData}
                      dataKey="count"
                      nameKey="type"
                      innerRadius={62}
                      outerRadius={92}
                      paddingAngle={4}
                      strokeWidth={3}
                    >
                      {problemData.map((item) => (
                        <Cell
                          key={item.key}
                          fill={item.fill}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total problems
                    </p>
                    <p className="text-3xl font-bold tracking-tight">
                      {totalProblems}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        label: "MCQ",
                        count: statistics.problems.mcq,
                        color: chartColors.mcq,
                      },
                      {
                        label: "Written",
                        count: statistics.problems.written,
                        color: chartColors.written,
                      },
                      {
                        label: "Coding",
                        count: statistics.problems.coding,
                        color: chartColors.coding,
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between gap-3"
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <span
                            className="size-2.5 shrink-0 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-sm text-muted-foreground">
                            {item.label}
                          </span>
                        </div>

                        <span className="text-sm font-semibold tabular-nums">
                          {item.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Problem type bar chart */}
        <Card className="overflow-hidden">
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <CardTitle className="text-base">
                  Problem Type Comparison
                </CardTitle>
                <CardDescription>
                  Compare the number of problems in each category.
                </CardDescription>
              </div>

              <div className="rounded-lg bg-primary/10 p-2">
                <BarChart3 className="size-5 text-primary" />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {!hasProblems ? (
              <div className="flex h-[260px] flex-col items-center justify-center text-center">
                <BarChart3 className="mb-3 size-10 text-muted-foreground/50" />
                <p className="font-medium">Nothing to compare yet</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Your problem counts will appear here.
                </p>
              </div>
            ) : (
              <ChartContainer
                config={problemTypeConfig}
                className="h-[260px] w-full"
              >
                <BarChart
                  accessibilityLayer
                  data={[
                    {
                      type: "MCQ",
                      count: statistics.problems.mcq,
                      fill: chartColors.mcq,
                    },
                    {
                      type: "Written",
                      count: statistics.problems.written,
                      fill: chartColors.written,
                    },
                    {
                      type: "Coding",
                      count: statistics.problems.coding,
                      fill: chartColors.coding,
                    },
                  ]}
                  layout="vertical"
                  margin={{
                    top: 8,
                    right: 16,
                    bottom: 0,
                    left: 8,
                  }}
                >
                  <CartesianGrid
                    horizontal={false}
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    type="number"
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    type="category"
                    dataKey="type"
                    axisLine={false}
                    tickLine={false}
                    width={64}
                  />

                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />

                  <Bar
                    dataKey="count"
                    radius={[0, 6, 6, 0]}
                    maxBarSize={38}
                  >
                    {[
                      chartColors.mcq,
                      chartColors.written,
                      chartColors.coding,
                    ].map((color, index) => (
                      <Cell
                        key={index}
                        fill={color}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Assessment usage insight */}
      <Card className="border-primary/15 bg-gradient-to-br from-primary/[0.07] via-card to-card">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <ClipboardCheck className="size-5 text-primary" />
            </div>

            <div>
              <h3 className="font-semibold">
                Assessment Reach
              </h3>
              <p className="mt-1 max-w-lg text-sm text-muted-foreground">
                The number of unique assessments that use at least one
                problem from your problem bank.
              </p>
            </div>
          </div>

          <div className="sm:text-right">
            <p className="text-3xl font-bold tracking-tight">
              {totalAssessments}
            </p>
            <p className="text-sm text-muted-foreground">
              {totalAssessments === 1
                ? "Assessment"
                : "Assessments"}
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

