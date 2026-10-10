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

const defaultValues: CreateProblemFormValues = {
  title: "",
  description: "",
  type: ProblemType.MCQ,
  difficulty: ProblemDifficulty.MEDIUM,
  points: 10,
  options: [
    { text: "", isCorrect: true },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
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
      const payload: CreateProblemFormValues = {
        title: value.title.trim(),
        description: value.description.trim(),
        type: ProblemType.MCQ,
        difficulty: value.difficulty,
        points: value.points,
        options: value.options.map((option) => ({
          text: option.text.trim(),
          isCorrect: option.isCorrect,
        })),
      };

      try {
        await createProblemMutation.mutateAsync(payload);
        router.push("/problems");
      } catch {
        // Mutation error is displayed below.
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

      {/* MCQ Options Only */}
      <MCQOptionsSection
        form={form}
        disabled={isSubmitting}
      />

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

        <form.Subscribe
          selector={(state) => ({
            canSubmit: state.canSubmit,
            isSubmittingForm: state.isSubmitting,
            values: state.values,
          })}
        >
          {({ canSubmit, isSubmittingForm, values }) => {
            const validation = createProblemSchema.safeParse(values);

            const isFormValid =
              validation.success &&
              values.title.trim().length > 0 &&
              values.description.trim().length > 0;

            const isDisabled =
              !canSubmit ||
              !isFormValid ||
              isSubmitting ||
              isSubmittingForm;

            return (
              <Button
                type="submit"
                disabled={isDisabled}
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
            );
          }}
        </form.Subscribe>
      </div>
    </form>
  );
}

