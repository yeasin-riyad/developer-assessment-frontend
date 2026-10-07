"use client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock3,
  Loader2,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  useAttempt,
  useAttemptQuestions,
  useSaveAnswer,
  useStartAttempt,
  useSubmitAttempt,
} from "../hooks";
import type {
  AssessmentProblem,
  AttemptAnswer,
  AttemptStatusValue,
} from "../types";
import { AttemptTimer } from "./attempt-timer";
import { useQueryClient } from "@tanstack/react-query";
import { assessmentQueryKeys } from "@/features/assessments";

interface AttemptPageProps {
  attemptId: string;
}

export function AttemptPage({ attemptId }: AttemptPageProps) {
  const attemptQuery = useAttempt(attemptId);

  const attempt = attemptQuery.data;

  const questionsQuery = useAttemptQuestions(
    attemptId,
    attempt?.status === "IN_PROGRESS",
  );

  const startMutation = useStartAttempt();
  const saveAnswerMutation = useSaveAnswer();
  const submitMutation = useSubmitAttempt();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [answers, setAnswers] = useState<Record<string, string>>({});

  const [savingProblemId, setSavingProblemId] = useState<string | null>(null);

  const [submitted, setSubmitted] = useState(false);

  /**
   * Restore existing answers from the server.
   */
  useEffect(() => {
    if (!attempt?.answers) {
      return;
    }

    const serverAnswers = attempt.answers.reduce<Record<string, string>>(
      (accumulator, answer) => {
        accumulator[answer.problemId] = answer.answer;
        return accumulator;
      },
      {},
    );

    setAnswers(serverAnswers);
  }, [attempt?.answers]);

  /**
   * Questions returned by backend.
   */
  const problems = useMemo(
    () => questionsQuery.data?.problems ?? [],
    [questionsQuery.data?.problems],
  );

  const currentProblem: AssessmentProblem | undefined =
    problems[currentQuestionIndex];

  /**
   * Start assessment.
   */
  const handleStart = () => {
    startMutation.mutate(attemptId, {
      onSuccess: () => {
        toast.success("Assessment started", {
          description: "Your timer has started. Good luck!",
        });
      },
      onError: (error) => {
        toast.error("Unable to start assessment", {
          description:
            error instanceof Error ? error.message : "Something went wrong.",
        });
      },
    });
  };

  /**
   * Submit assessment.
   */
  const router = useRouter();
  const queryClient = useQueryClient();
/**
 * Submit assessment.
 */
const handleSubmit = useCallback(
  (automatic = false) => {
    if (submitted || submitMutation.isPending) {
      return;
    }

    submitMutation.mutate(attemptId, {
      onSuccess: async (result) => {
        setSubmitted(true);

        if (result.status === "EXPIRED") {
          toast.warning("Time expired", {
            description: "Your assessment has been submitted as expired.",
          });
        } else {
          toast.success(
            automatic
              ? "Assessment submitted automatically"
              : "Assessment submitted successfully",
            {
              description: "Your responses have been recorded.",
            },
          );
        }

        // Refetch candidate assessments
        await queryClient.invalidateQueries({
          queryKey: assessmentQueryKeys.candidate(),
        });

        // Navigate to result page
        router.push(`/assessments/attempts/${attemptId}/result`);
      },

      onError: (error) => {
        toast.error("Unable to submit assessment", {
          description:
            error instanceof Error
              ? error.message
              : "Something went wrong.",
        });
      },
    });
  },
  [
    attemptId,
    submitMutation,
    submitted,
    queryClient,
    router,
  ],
);
  /**
   * Timer expiry.
   */
  const handleExpire = useCallback(() => {
    if (
      attempt?.status === "IN_PROGRESS" &&
      !submitted &&
      !submitMutation.isPending
    ) {
      handleSubmit(true);
    }
  }, [attempt?.status, handleSubmit, submitted, submitMutation.isPending]);

  /**
   * Save answer.
   */
  const handleAnswerChange = (problem: AssessmentProblem, answer: string) => {
    /*
     * Once an answer has been selected,
     * the candidate cannot change it.
     */
    const existingAnswer = answers[problem.problemId];

    if (existingAnswer) {
      return;
    }

    setAnswers((previous) => ({
      ...previous,
      [problem.problemId]: answer,
    }));

    setSavingProblemId(problem.problemId);

    saveAnswerMutation.mutate(
      {
        attemptId,
        payload: {
          problemId: problem.problemId,
          answer,
        },
      },
      {
        onSuccess: () => {
          setSavingProblemId(null);
        },

        onError: (error) => {
          /*
           * Important:
           * If saving fails, remove the local answer
           * so the candidate can try again.
           */
          setAnswers((previous) => {
            const updated = { ...previous };

            delete updated[problem.problemId];

            return updated;
          });

          setSavingProblemId(null);

          toast.error("Failed to save answer", {
            description:
              error instanceof Error ? error.message : "Please try again.",
          });
        },
      },
    );
  };

  /**
   * Loading attempt.
   */
  if (attemptQuery.isLoading) {
    return <AttemptLoading />;
  }

  /**
   * Attempt error.
   */
  if (attemptQuery.isError || !attempt) {
    return (
      <AttemptError
        message={
          attemptQuery.error instanceof Error
            ? attemptQuery.error.message
            : "Unable to load assessment."
        }
      />
    );
  }

  /**
   * Submitted state.
   */
  if (attempt.status === "SUBMITTED" || submitted) {
    return (
      <AttemptFinished
        status="SUBMITTED"
        assessmentTitle={attempt.assessment?.title ?? "Assessment"}
      />
    );
  }

  /**
   * Expired state.
   */
  if (attempt.status === "EXPIRED") {
    return (
      <AttemptFinished
        status="EXPIRED"
        assessmentTitle={attempt.assessment?.title ?? "Assessment"}
      />
    );
  }

  /**
   * Not started.
   */
  if (attempt.status === "NOT_STARTED") {
    return (
      <StartAttemptScreen
        title={attempt.assessment?.title ?? "Assessment"}
        duration={attempt.assessment?.duration ?? 0}
        totalMarks={attempt.assessment?.totalMarks ?? 0}
        isStarting={startMutation.isPending}
        onStart={handleStart}
      />
    );
  }

  /**
   * Questions loading.
   */
  if (questionsQuery.isLoading) {
    return <AttemptLoading />;
  }

  /**
   * Questions error.
   */
  if (questionsQuery.isError || !questionsQuery.data) {
    console.error("Attempt questions error:", questionsQuery.error);

    return (
      <AttemptError
        message={
          questionsQuery.error
            ? String(
                questionsQuery.error instanceof Error
                  ? questionsQuery.error.message
                  : questionsQuery.error,
              )
            : "Unable to load assessment questions."
        }
      />
    );
  }

  if (!currentProblem) {
    return (
      <AttemptError message="No questions are available for this assessment." />
    );
  }

  const selectedAnswer = answers[currentProblem.problemId] ?? "";

  const answeredCount = problems.filter((problem) =>
    Boolean(answers[problem.problemId]?.trim()),
  ).length;

  const isFirstQuestion = currentQuestionIndex === 0;

  const isLastQuestion = currentQuestionIndex === problems.length - 1;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold text-slate-900">
              {attempt.assessment?.title ?? "Assessment"}
            </h1>

            <p className="text-sm text-slate-500">
              Question {currentQuestionIndex + 1} of {problems.length}
            </p>
          </div>

          {questionsQuery.data.expiresAt && (
            <AttemptTimer
              expiresAt={questionsQuery.data.expiresAt}
              onExpire={handleExpire}
            />
          )}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          {/* Question */}
          <section className="rounded-xl border bg-white shadow-sm">
            <div className="border-b px-6 py-5">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                  {currentProblem.problem.type}
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  {currentProblem.problem.difficulty}
                </span>
              </div>

              <h2 className="text-xl font-semibold leading-8 text-slate-900">
                {currentProblem.problem.title}
              </h2>

              {currentProblem.problem.description && (
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                  {currentProblem.problem.description}
                </p>
              )}
            </div>

            <div className="px-6 py-6">
              {currentProblem.problem.type === "MCQ" ? (
                <MCQAnswer
                  problem={currentProblem}
                  value={selectedAnswer}
                  disabled={savingProblemId === currentProblem.problemId}
                  onChange={(answer) =>
                    handleAnswerChange(currentProblem, answer)
                  }
                />
              ) : (
                <WrittenAnswer
                  value={selectedAnswer}
                  onChange={(answer) =>
                    handleAnswerChange(currentProblem, answer)
                  }
                />
              )}

              {savingProblemId === currentProblem.problemId && (
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                  <Loader2 className="size-3 animate-spin" />
                  Saving answer...
                </div>
              )}

              {savingProblemId !== currentProblem.problemId &&
                selectedAnswer && (
                  <div className="mt-4 flex items-center gap-2 text-xs text-emerald-600">
                    <CheckCircle2 className="size-3.5" />
                    Answer saved
                  </div>
                )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between border-t px-6 py-4">
              <button
                type="button"
                disabled={isFirstQuestion}
                onClick={() =>
                  setCurrentQuestionIndex((previous) =>
                    Math.max(0, previous - 1),
                  )
                }
                className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="size-4" />
                Previous
              </button>

              {isLastQuestion ? (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      type="button"
                      disabled={!selectedAnswer || submitMutation.isPending}
                      className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {submitMutation.isPending ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="size-4" />
                          Submit Assessment
                        </>
                      )}
                    </button>
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Submit your assessment?
                      </AlertDialogTitle>

                      <AlertDialogDescription>
                        Are you sure you want to submit your assessment? Once
                        submitted, you will not be able to change your answers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>

                      <AlertDialogAction
                        onClick={handleSubmit}
                        disabled={submitMutation.isPending}
                      >
                        {submitMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 size-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          "Yes, Submit"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              ) : (
                <button
                  type="button"
                  disabled={!selectedAnswer}
                  onClick={() =>
                    setCurrentQuestionIndex((previous) =>
                      Math.min(problems.length - 1, previous + 1),
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                  <ChevronRight className="size-4" />
                </button>
              )}
            </div>
          </section>

          {/* Sidebar */}
          <aside className="h-fit space-y-4 lg:sticky lg:top-24">
            <div className="rounded-xl border bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">Questions</h3>

                <span className="text-xs text-slate-500">
                  {answeredCount}/{problems.length}
                </span>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {problems.map((problem, index) => {
                  const answered = Boolean(answers[problem.problemId]?.trim());

                  const active = index === currentQuestionIndex;

                  return (
                    <button
                      key={problem.problemId}
                      type="button"
                      disabled={index > currentQuestionIndex + 1}
                      onClick={() => {
                        /*
                         * Allow going back to previous questions.
                         */
                        if (index <= currentQuestionIndex) {
                          setCurrentQuestionIndex(index);
                          return;
                        }

                        /*
                         * Allow moving to the immediate next
                         * question only when current question
                         * has been answered.
                         */
                        if (
                          index === currentQuestionIndex + 1 &&
                          selectedAnswer
                        ) {
                          setCurrentQuestionIndex(index);
                        }
                      }}
                      className={[
                        "flex size-9 items-center justify-center rounded-lg text-xs font-semibold transition",

                        active
                          ? "bg-indigo-600 text-white"
                          : answered
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-600",

                        index > currentQuestionIndex + 1
                          ? "cursor-not-allowed opacity-40"
                          : "hover:bg-slate-200",
                      ].join(" ")}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 space-y-2 border-t pt-4 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Circle className="size-3 fill-indigo-600 text-indigo-600" />
                  Current
                </div>

                <div className="flex items-center gap-2">
                  <Circle className="size-3 fill-emerald-500 text-emerald-500" />
                  Answered
                </div>

                <div className="flex items-center gap-2">
                  <Circle className="size-3 text-slate-300" />
                  Unanswered
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-5">
              <div className="flex gap-3">
                <ShieldCheck className="mt-0.5 size-5 shrink-0 text-indigo-600" />

                <div>
                  <p className="text-sm font-semibold text-indigo-900">
                    Assessment rules
                  </p>

                  <p className="mt-1 text-xs leading-5 text-indigo-700">
                    Your answers are saved automatically. The server controls
                    the assessment deadline.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Start Screen                                                               */
/* -------------------------------------------------------------------------- */

interface StartAttemptScreenProps {
  title: string;
  duration: number;
  totalMarks: number;
  isStarting: boolean;
  onStart: () => void;
}

function StartAttemptScreen({
  title,
  duration,
  totalMarks,
  isStarting,
  onStart,
}: StartAttemptScreenProps) {
  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-2xl rounded-2xl border bg-white p-8 shadow-sm sm:p-10">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-indigo-50">
          <Sparkles className="size-7 text-indigo-600" />
        </div>

        <div className="mt-6 text-center">
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">
            You are about to start your assessment. Make sure you have enough
            time and a stable internet connection.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <InfoCard
            icon={<Clock3 className="size-5" />}
            label="Duration"
            value={`${duration} minutes`}
          />

          <InfoCard
            icon={<CheckCircle2 className="size-5" />}
            label="Total marks"
            value={`${totalMarks}`}
          />
        </div>

        <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex gap-3">
            <AlertCircle className="mt-0.5 size-5 shrink-0 text-amber-600" />

            <div>
              <p className="text-sm font-semibold text-amber-900">
                Before you start
              </p>

              <ul className="mt-2 space-y-1 text-xs leading-5 text-amber-800">
                <li>• The timer starts immediately after clicking Start.</li>
                <li>• Your answers are saved automatically.</li>
                <li>• The assessment will be submitted when time expires.</li>
              </ul>
            </div>
          </div>
        </div>

        <button
          type="button"
          disabled={isStarting}
          onClick={onStart}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isStarting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Starting Assessment...
            </>
          ) : (
            <>
              Start Assessment
              <ChevronRight className="size-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border bg-slate-50 p-4">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm">
          {icon}
        </div>

        <div>
          <p className="text-xs text-slate-500">{label}</p>

          <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* MCQ                                                                        */
/* -------------------------------------------------------------------------- */

function MCQAnswer({
  problem,
  value,
  disabled,
  onChange,
}: {
  problem: AssessmentProblem;
  value: string;
  disabled: boolean;
  onChange: (answer: string) => void;
}) {
  const answered = Boolean(value);

  return (
    <div className="space-y-3">
      {problem.problem.options.map((option, index) => {
        const selected = value === option.id;

        return (
          <button
            key={option.id}
            type="button"
            disabled={disabled || answered}
            onClick={() => onChange(option.id)}
            className={[
              "flex w-full items-start gap-4 rounded-xl border p-4 text-left transition",

              selected
                ? "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500"
                : "border-slate-200",

              !answered && !disabled
                ? "hover:border-slate-300 hover:bg-slate-50"
                : "",

              answered && !selected ? "cursor-not-allowed opacity-50" : "",

              selected ? "cursor-not-allowed" : "",
            ].join(" ")}
          >
            <span
              className={[
                "flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold",

                selected
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-600",
              ].join(" ")}
            >
              {String.fromCharCode(65 + index)}
            </span>

            <span className="pt-1 text-sm leading-6 text-slate-700">
              {option.text}
            </span>
          </button>
        );
      })}

      {/* {answered && (
        <p className="mt-3 text-xs font-medium text-emerald-600">
          Answer selected. You cannot change your answer.
        </p>
      )} */}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Written                                                                    */
/* -------------------------------------------------------------------------- */

function WrittenAnswer({
  value,
  onChange,
}: {
  value: string;
  onChange: (answer: string) => void;
}) {
  return (
    <div>
      <label
        htmlFor="written-answer"
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        Your answer
      </label>

      <textarea
        id="written-answer"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={12}
        placeholder="Write your answer here..."
        className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
      />

      <p className="mt-2 text-xs text-slate-400">
        Your answer is saved automatically.
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Finished                                                                   */
/* -------------------------------------------------------------------------- */

function AttemptFinished({
  status,
  assessmentTitle,
}: {
  status: "SUBMITTED" | "EXPIRED";
  assessmentTitle: string;
}) {
  const expired = status === "EXPIRED";

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-xl rounded-2xl border bg-white p-8 text-center shadow-sm sm:p-10">
        <div
          className={[
            "mx-auto flex size-16 items-center justify-center rounded-full",
            expired ? "bg-amber-50" : "bg-emerald-50",
          ].join(" ")}
        >
          {expired ? (
            <Clock3 className="size-8 text-amber-600" />
          ) : (
            <CheckCircle2 className="size-8 text-emerald-600" />
          )}
        </div>

        <h1 className="mt-6 text-2xl font-bold text-slate-900">
          {expired ? "Assessment Time Expired" : "Assessment Submitted"}
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          {expired
            ? `Your time for "${assessmentTitle}" has expired. Your saved answers have been recorded.`
            : `Your answers for "${assessmentTitle}" have been submitted successfully.`}
        </p>

        <div className="mt-8 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
          {expired
            ? "Your submission will be processed for evaluation."
            : "Thank you for completing the assessment."}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Loading                                                                    */
/* -------------------------------------------------------------------------- */

function AttemptLoading() {
  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="size-8 animate-spin text-indigo-600" />

        <p className="text-sm text-slate-500">Loading assessment...</p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Error                                                                      */
/* -------------------------------------------------------------------------- */

function AttemptError({ message }: { message: string }) {
  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-50">
          <AlertCircle className="size-6 text-red-600" />
        </div>

        <h1 className="mt-4 text-lg font-semibold text-slate-900">
          Unable to load assessment
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">{message}</p>
      </div>
    </div>
  );
}
