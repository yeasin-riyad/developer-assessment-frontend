"use client";

import {
  ClipboardCheck,
  FileText,
  Users,
  BarChart3,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/providers/auth.provider";



export default function DashboardPage() {
  const { user } = useAuth();

  const stats = [
    {
      title: "Total Assessments",
      value: "24",
      description: "Created assessments",
      icon: ClipboardCheck,
    },
    {
      title: "Problems",
      value: "128",
      description: "In your problem bank",
      icon: FileText,
    },
    {
      title: "Candidates",
      value: "356",
      description: "Registered candidates",
      icon: Users,
    },
    {
      title: "Evaluations",
      value: "89",
      description: "Pending evaluations",
      icon: BarChart3,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Here&apos;s an overview of your
          assessment platform.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>

                <Icon className="size-4 text-muted-foreground" />
              </CardHeader>

              <CardContent>
                <div className="text-2xl font-bold">
                  {stat.value}
                </div>

                <p className="mt-1 text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Welcome */}
      <Card>
        <CardHeader>
          <CardTitle>
            Welcome, {user?.name}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground">
            You are signed in as{" "}
            <span className="font-medium text-foreground">
              {user?.role}
            </span>
            . Use the sidebar to manage your
            assessment workflow.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}