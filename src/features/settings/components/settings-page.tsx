
"use client";

import {
  UserRound,
  LockKeyhole,
  ShieldCheck,
  Settings2,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { ProfileSettings } from "./profile-settings";
import { PasswordSettings } from "./password-settings";
import { AccountSettings } from "./account-settings";

export function SettingsPage() {
  return (
    <main className="min-h-full space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Page heading */}
      <div className="flex items-start gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Settings2 className="size-6" />
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Settings
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
            Manage your profile, security preferences, and account
            information.
          </p>
        </div>
      </div>

      {/* Settings content */}
      <Card className="overflow-hidden border-border/70 shadow-sm">
        <CardHeader className="border-b bg-muted/20 px-5 py-5 sm:px-6">
          <CardTitle className="text-lg">Account settings</CardTitle>
          <CardDescription>
            Update your personal information and manage your account security.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid h-auto w-full grid-cols-3 gap-1 rounded-xl  bg-muted p-1">
              <TabsTrigger
                value="profile"
                className="gap-2  rounded-lg py-2.5 text-xs sm:text-sm"
              >
                <UserRound className="size-4 shrink-0" />
                <span>Profile</span>
              </TabsTrigger>

              <TabsTrigger
                value="security"
                className="gap-2 rounded-lg py-2.5 text-xs sm:text-sm"
              >
                <LockKeyhole className="size-4 shrink-0" />
                <span>Security</span>
              </TabsTrigger>

              <TabsTrigger
                value="account"
                className="gap-2 rounded-lg py-2.5 text-xs sm:text-sm"
              >
                <ShieldCheck className="size-4 shrink-0" />
                <span>Account</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <ProfileSettings />
            </TabsContent>

            <TabsContent value="security" className="mt-6">
              <PasswordSettings />
            </TabsContent>

            <TabsContent value="account" className="mt-6">
              <AccountSettings />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Security reminder */}
      <div className="flex items-start gap-3 rounded-xl border border-blue-200/70 bg-blue-50/60 p-4 dark:border-blue-900/60 dark:bg-blue-950/20">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-blue-600 dark:text-blue-400" />

        <div className="space-y-1">
          <p className="text-sm font-medium">Keep your account secure</p>
          <p className="text-sm text-muted-foreground">
            Use a strong password and keep your account information up to date.
            If you signed in with Google, manage your password through your
            Google account.
          </p>
        </div>
      </div>
    </main>
  );
}

