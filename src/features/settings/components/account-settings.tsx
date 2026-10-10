
"use client";

import {
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  Fingerprint,
  Loader2,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useMySettings } from "../useSettings";

const roleLabels: Record<string, string> = {
  ADMIN: "Administrator",
  RECRUITER: "Recruiter",
  CREATOR: "Creator",
  EVALUATOR: "Evaluator",
  CANDIDATE: "Candidate",
};

export function AccountSettings() {
  const { data: user, isLoading, isError } = useMySettings();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center py-12">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !user) {
    return (
      <Card>
        <CardContent className="py-8 text-sm text-destructive">
          Failed to load account information.
        </CardContent>
      </Card>
    );
  }

  const accountDetails = [
    { label: "Full name", value: user.name, icon: UserRound },
    { label: "Email address", value: user.email, icon: Mail },
    {
      label: "Account role",
      value: roleLabels[user.role] ?? user.role,
      icon: ShieldCheck,
    },
    {
      label: "Sign-in method",
      value:
        user.authProvider === "GOOGLE"
          ? "Google"
          : "Email and password",
      icon: Fingerprint,
    },
    {
      label: "Member since",
      value: new Date(user.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      icon: CalendarDays,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <ShieldCheck className="size-5 text-primary" />
          </div>

          <div className="flex-1">
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              Review your account details and status.
            </CardDescription>
          </div>

          <Badge variant={user.isActive ? "default" : "destructive"}>
            {user.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="flex items-start gap-3 rounded-lg border p-4">
          {user.isActive ? (
            <CheckCircle2 className="mt-0.5 size-5 text-green-600" />
          ) : (
            <CircleAlert className="mt-0.5 size-5 text-destructive" />
          )}

          <div>
            <p className="text-sm font-medium">
              {user.isActive
                ? "Your account is active"
                : "Your account is inactive"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {user.isActive
                ? "Your account is currently enabled."
                : "Contact your platform administrator if you believe this is a mistake."}
            </p>
          </div>
        </div>

        <Separator />

        <div>
          {accountDetails.map((item, index) => {
            const Icon = item.icon;

            return (
              <div key={item.label}>
                {index > 0 && <Separator />}

                <div className="flex items-center gap-3 py-4">
                  <div className="rounded-md bg-muted p-2">
                    <Icon className="size-4 text-muted-foreground" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="mt-1 break-words text-sm font-medium">
                      {item.value}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}