
"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  Home,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({
  error,
  reset,
}: ErrorPageProps) {
  useEffect(() => {
    // Send the error to your monitoring service if configured.
    console.error("Application error:", error);
  }, [error]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-12">
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-indigo-200/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -right-24 size-80 rounded-full bg-blue-200/40 blur-3xl"
      />

      <Card className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/50">
        {/* Top accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-blue-500 to-violet-500" />

        <CardHeader className="items-center px-6 pb-2 pt-10 text-center sm:px-10">
          <div className="relative mb-6 flex size-20 items-center justify-center rounded-2xl bg-red-50 ring-1 ring-red-100">
            <div className="absolute inset-0 animate-pulse rounded-2xl bg-red-100/30" />
            <AlertTriangle
              aria-hidden="true"
              className="relative size-10 text-red-500"
              strokeWidth={1.7}
            />
          </div>

          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
            <ShieldAlert className="size-3.5" />
            APPLICATION ERROR
          </div>

          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Oops! Something went wrong
          </CardTitle>

          <CardDescription className="mt-3 max-w-sm text-sm leading-6 text-slate-500 sm:text-base">
            We encountered an unexpected problem while loading
            this page. Don&apos;t worry — your next step is just
            one click away.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 pt-6 sm:px-10">
          {process.env.NODE_ENV === "development" && (
            <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-left">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-amber-800">
                Development details
              </p>
              <p className="break-words text-sm text-amber-900">
                {error.message || "Unknown application error"}
              </p>
              {error.digest && (
                <p className="mt-2 text-xs text-amber-700">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-800">
              Here&apos;s what you can do
            </p>
            <ul className="mt-3 space-y-2.5 text-sm text-slate-600">
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <RefreshCw className="size-3" />
                </span>
                Try reloading this page.
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
                  <Home className="size-3" />
                </span>
                Return to your dashboard and continue working.
              </li>
            </ul>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 px-6 pb-8 pt-2 sm:flex-row sm:px-10">
          <Button
            type="button"
            onClick={reset}
            className="h-11 w-full gap-2 rounded-xl bg-indigo-600 font-medium text-white shadow-sm transition-colors hover:bg-indigo-700"
          >
            <RefreshCw className="size-4" />
            Try again
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-11 w-full gap-2 rounded-xl border-slate-200 font-medium text-slate-700 hover:bg-slate-50"
          >
            <Link href="/dashboard">
              <ArrowLeft className="size-4" />
              Go to Dashboard
            </Link>
          </Button>
        </CardFooter>

        <div className="border-t border-slate-100 px-6 py-4 text-center">
          <p className="text-xs text-slate-400">
            Developer Assessment Platform
            <span className="mx-2">•</span>
            We&apos;re here to help you get back on track.
          </p>
        </div>
      </Card>
    </main>
  );
}
