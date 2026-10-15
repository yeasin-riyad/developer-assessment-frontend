
import { LoaderCircle, Sparkles } from "lucide-react";

export default function Loading() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50 px-4">
      {/* Background decorations */}
      <div className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-indigo-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 size-80 rounded-full bg-violet-200/30 blur-3xl" />

      {/* Loading content */}
      <section className="relative z-10 flex w-full max-w-md flex-col items-center rounded-3xl border border-white/80 bg-white/70 px-6 py-12 text-center shadow-xl shadow-indigo-100/40 backdrop-blur-xl sm:px-10">
        {/* Logo / Icon */}
        <div className="relative mb-7 flex size-20 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-200">
          <Sparkles className="size-9" />

          <span className="absolute -right-2 -top-2 flex size-7 items-center justify-center rounded-full border-4 border-white bg-indigo-100">
            <span className="size-2 rounded-full bg-indigo-600" />
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Just a moment
        </h1>

        <p className="mt-3 max-w-xs text-sm leading-6 text-slate-500 sm:text-base">
          We&apos;re getting everything ready for you. Please wait a moment.
        </p>

        {/* Spinner */}
        <div className="mt-8 flex items-center gap-3">
          <LoaderCircle className="size-5 animate-spin text-indigo-600" />

          <span className="text-sm font-medium text-indigo-700">
            Loading your experience...
          </span>
        </div>

        {/* Progress animation */}
        <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-indigo-100">
          <div className="h-full w-1/3 animate-loading-bar rounded-full bg-gradient-to-r from-blue-500 via-indigo-600 to-violet-500" />
        </div>

        {/* Footer */}
        <p className="mt-8 text-xs font-medium tracking-wide text-slate-400">
          THANK YOU FOR YOUR PATIENCE
        </p>
      </section>
    </main>
  );
}


