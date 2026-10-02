"use client";
import { ApiError } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { Loader2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  createAssessmentSchema,
  useCreateAssessment,
  type CreateAssessmentFormValues,
} from "@/features/assessments";

import { validateWithZod } from "@/lib/form-validation";

import { AssessmentBasicInfo } from "./assessment-basic-info";

const defaultValues: CreateAssessmentFormValues = {
  title: "",
  description: "",
  duration: 60,
};

export function AssessmentForm() {
  const router = useRouter();

  const createAssessmentMutation = useCreateAssessment();

  const form = useForm({
    defaultValues,

    validators: {
      onChange: ({ value }) => validateWithZod(createAssessmentSchema, value),
    },

    onSubmit: async ({ value }) => {
      try {
        const payload = {
          title: value.title.trim(),

          ...(value.description?.trim()
            ? {
                description: value.description.trim(),
              }
            : {}),

          duration: value.duration,
        };

        const response = await createAssessmentMutation.mutateAsync(payload);

        router.push(`/assessments/${response.data.id}`);
      } catch {
        // API error is displayed below.
      }
    },
  });

  const isSubmitting = createAssessmentMutation.isPending;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();

        form.handleSubmit();
      }}
      className="space-y-6"
    >
      <AssessmentBasicInfo form={form} disabled={isSubmitting} />

      {/* API Error */}
      {createAssessmentMutation.isError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3">
          <p className="text-sm font-medium text-destructive">
            Failed to create assessment
          </p>

          {createAssessmentMutation.isError && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3">
              <p className="text-sm font-medium text-destructive">
                {createAssessmentMutation.error instanceof ApiError
                  ? createAssessmentMutation.error.message
                  : createAssessmentMutation.error instanceof Error
                    ? createAssessmentMutation.error.message
                    : "Something went wrong. Please try again."}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={() => router.push("/assessments")}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Plus className="mr-2 size-4" />
              Create Assessment
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
