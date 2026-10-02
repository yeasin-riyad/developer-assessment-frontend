"use client";

import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { Loader2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  ProblemDifficulty,
  ProblemType,
  createProblemSchema,
  useCreateProblem,
  type CreateProblemFormValues,
} from "@/features/problems";

import { validateWithZod } from "@/lib/form-validation";

import { ProblemBasicInfo } from "./problem-basic-info";
import { MCQOptionsSection } from "./mcq-options-section";
import { WrittenProblemSection } from "./written-problem-section";

const defaultValues: CreateProblemFormValues = {
  title: "",
  description: "",
  type: ProblemType.MCQ,
  difficulty: ProblemDifficulty.MEDIUM,
  points: 10,

  options: [
    {
      text: "",
      isCorrect: true,
    },
    {
      text: "",
      isCorrect: false,
    },
    {
      text: "",
      isCorrect: false,
    },
    {
      text: "",
      isCorrect: false,
    },
  ],
};

export function ProblemForm() {
  const router = useRouter();

  const createProblemMutation = useCreateProblem();

  const form = useForm({
    defaultValues,

    validators: {
      onChange: ({ value }) =>
        validateWithZod(createProblemSchema, value),
    },

    onSubmit: async ({ value }) => {
      try {
        const payload: CreateProblemFormValues = {
          title: value.title.trim(),
          description: value.description.trim(),
          type: value.type,
          difficulty: value.difficulty,
          points: value.points,

          ...(value.type === ProblemType.MCQ
            ? {
                options: value.options,
              }
            : {}),
        };

        await createProblemMutation.mutateAsync(payload);

        router.push("/problems");
      } catch {
        // API error is handled below.
      }
    },
  });

  const isSubmitting = createProblemMutation.isPending;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();

        form.handleSubmit();
      }}
      className="space-y-6"
    >
      {/* Basic Information */}
      <ProblemBasicInfo
        form={form}
        disabled={isSubmitting}
      />

      {/* Dynamic Problem Content */}
      <form.Subscribe
        selector={(state) => state.values.type}
      >
        {(type) => {
          if (type === ProblemType.MCQ) {
            return (
              <MCQOptionsSection
                form={form}
                disabled={isSubmitting}
              />
            );
          }

          return <WrittenProblemSection />;
        }}
      </form.Subscribe>

      {/* API Error */}
      {createProblemMutation.isError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3">
          <p className="text-sm font-medium text-destructive">
            Failed to create problem
          </p>

          <p className="mt-1 text-sm text-destructive/90">
            {createProblemMutation.error instanceof Error
              ? createProblemMutation.error.message
              : "Something went wrong. Please try again."}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={() => router.push("/problems")}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Plus className="mr-2 size-4" />
              Create Problem
            </>
          )}
        </Button>
      </div>
    </form>
  );
}