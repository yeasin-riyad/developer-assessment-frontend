import Link from "next/link";
import { ArrowRight, Home, SearchX, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import BackButton from "@/components/shared/back-button";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-4 py-12">
      {/* Background decorations */}
      <div className="pointer-events-none absolute -left-24 -top-24 size-80 rounded-full bg-indigo-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 size-96 rounded-full bg-violet-200/30 blur-3xl" />

      <section className="relative z-10 mx-auto w-full max-w-2xl text-center">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative flex size-20 items-center justify-center rounded-3xl border border-indigo-100 bg-white/80 shadow-xl shadow-indigo-100/60 backdrop-blur">
            <SearchX className="size-10 text-indigo-600" />

            <span className="absolute -right-2 -top-2 flex size-7 items-center justify-center rounded-full bg-violet-600 text-white shadow-lg">
              <Sparkles className="size-4" />
            </span>
          </div>
        </div>

        {/* 404 */}
        <h1 className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-8xl font-black tracking-tighter text-transparent sm:text-9xl">
          404
        </h1>

        {/* Heading */}
        <h2 className="mt-5 text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Oops! Page Not Found
        </h2>

        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-500 sm:text-base">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>

        {/* Navigation */}
        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <BackButton />
          <Link
            href="/"
            className="group inline-flex min-h-11 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          >
            <Home className="size-4 shrink-0" />
            <span>Go to Home</span>
            <ArrowRight className="size-4 shrink-0 transition-transform group-hover:translate-x-1" />
          </Link>

          {/* Go to Home link here */}
        </div>

        {/* Footer */}
        <div className="mt-12">
          <div className="mx-auto mb-4 h-px w-16 bg-gradient-to-r from-transparent via-indigo-300 to-transparent" />

          <p className="text-xs font-medium tracking-wide text-slate-400">
            LOST IN THE DIGITAL SPACE?
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Don&apos;t worry, let&apos;s get you back on track.
          </p>
        </div>
      </section>
    </main>
  );
}
