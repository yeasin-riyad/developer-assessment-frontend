
"use client";

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
  Activity,
  ChartNoAxesColumn,
  ClipboardCheck,
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
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import type { CandidateInvitation } from "@/features/invitations/types";

interface CandidateDashboardChartsProps {
  invitations: CandidateInvitation[];
}

const statusColors: Record<string, string> = {
  INVITED: "var(--chart-1)",
  ACCEPTED: "var(--chart-2)",
  REJECTED: "var(--chart-3)",
  EXPIRED: "var(--chart-4)",
  CANCELLED: "var(--chart-5)",
};

const statusLabels: Record<string, string> = {
  INVITED: "Pending",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
  EXPIRED: "Expired",
  CANCELLED: "Cancelled",
};

const statusChartConfig = {
  count: {
    label: "Invitations",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const overviewChartConfig = {
  invitations: {
    label: "Invitations",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function CandidateDashboardCharts({
  invitations,
}: CandidateDashboardChartsProps) {
  const counts = invitations.reduce<Record<string, number>>(
    (result, invitation) => {
      result[invitation.status] =
        (result[invitation.status] ?? 0) + 1;

      return result;
    },
    {},
  );

  const statusData = Object.entries(counts).map(
    ([status, count]) => ({
      status,
      label: statusLabels[status] ?? status,
      count,
      fill: statusColors[status] ?? "var(--chart-5)",
    }),
  );

  const overviewData = [
    {
      name: "Pending",
      invitations: counts.INVITED ?? 0,
    },
    {
      name: "Accepted",
      invitations: counts.ACCEPTED ?? 0,
    },
    {
      name: "Other",
      invitations: invitations.filter(
        (invitation) =>
          invitation.status !== "INVITED" &&
          invitation.status !== "ACCEPTED",
      ).length,
    },
  ];

  const overviewTotal = overviewData.reduce(
    (total, item) => total + item.invitations,
    0,
  );

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card className="min-w-0">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Activity className="size-4" />
            </div>

            <div>
              <CardTitle className="text-base">
                Invitation Status
              </CardTitle>

              <CardDescription>
                Breakdown of your assessment invitations
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {statusData.length === 0 ? (
            <div className="flex h-[250px] flex-col items-center justify-center text-center">
              <ClipboardCheck className="mb-3 size-9 text-muted-foreground" />

              <p className="font-medium">
                No invitation data yet
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Your invitation chart will appear here.
              </p>
            </div>
          ) : (
            <>
              <ChartContainer
                config={statusChartConfig}
                className="mx-auto h-[250px] w-full"
              >
                <PieChart accessibilityLayer>
                  <Pie
                    data={statusData}
                    dataKey="count"
                    nameKey="label"
                    innerRadius={58}
                    outerRadius={90}
                    paddingAngle={3}
                  >
                    {statusData.map((entry) => (
                      <Cell
                        key={entry.status}
                        fill={entry.fill}
                      />
                    ))}
                  </Pie>

                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        hideLabel
                      />
                    }
                  />
                </PieChart>
              </ChartContainer>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {statusData.map((entry) => (
                  <div
                    key={entry.status}
                    className="flex items-center gap-2"
                  >
                    <span
                      className="size-2.5 shrink-0 rounded-full"
                      style={{
                        backgroundColor: entry.fill,
                      }}
                    />

                    <div className="min-w-0">
                      <p className="truncate text-xs text-muted-foreground">
                        {entry.label}
                      </p>

                      <p className="font-semibold">
                        {entry.count}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="min-w-0">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ChartNoAxesColumn className="size-4" />
            </div>

            <div>
              <CardTitle className="text-base">
                Assessment Overview
              </CardTitle>

              <CardDescription>
                Pending, accepted and other invitations
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {overviewTotal === 0 ? (
            <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
              No assessment activity to display.
            </div>
          ) : (
            <ChartContainer
              config={overviewChartConfig}
              className="h-[250px] w-full"
            >
              <BarChart
                accessibilityLayer
                data={overviewData}
                margin={{
                  top: 12,
                  right: 8,
                  left: -20,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                />

                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                />

                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                />

                <ChartTooltip
                  content={<ChartTooltipContent />}
                />

                <Bar
                  dataKey="invitations"
                  fill="var(--color-invitations)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={56}
                />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}