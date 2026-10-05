interface StartAttemptScreenProps {
  title: string;
  duration: number;
  totalMarks: number;
  isStarting: boolean;
  startError: Error | null;
  onStart: () => void;
}

export function StartAttemptScreen({
  title,
  duration,
  totalMarks,
  isStarting,
  startError,
  onStart,
}: StartAttemptScreenProps) {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center px-4 py-10">
      <div className="w-full rounded-xl border bg-card p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Clock3 className="size-6" />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Assessment
          </p>

          <h1 className="text-2xl font-bold tracking-tight">
            {title}
          </h1>

          <p className="text-sm leading-6 text-muted-foreground">
            Once you start the assessment, the timer
            will begin immediately. Make sure you have
            enough time to complete and submit your
            answers.
          </p>
        </div>

        <div className="my-6 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="text-xs text-muted-foreground">
              Duration
            </p>

            <p className="mt-1 font-semibold">
              {duration} minutes
            </p>
          </div>

          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="text-xs text-muted-foreground">
              Total marks
            </p>

            <p className="mt-1 font-semibold">
              {totalMarks}
            </p>
          </div>
        </div>

        {startError ? (
          <div className="mb-4 flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />

            <p>
              {startError.message ||
                "Unable to start the assessment."}
            </p>
          </div>
        ) : null}

        <button
          type="button"
          onClick={onStart}
          disabled={isStarting}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
        >
          {isStarting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Starting...
            </>
          ) : (
            <>
              <Play className="size-4" />
              Start Assessment
            </>
          )}
        </button>
      </div>
    </div>
  );
}