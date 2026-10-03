"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  useAssessment,
  useUpdateAssessment,
} from "../hooks";

import { useForm } from "@tanstack/react-form";

import { z } from "zod";

const editAssessmentSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title cannot exceed 200 characters"),

  description: z
    .string()
    .max(
      1000,
      "Description cannot exceed 1000 characters",
    ),

  duration: z
    .number()
    .int("Duration must be a whole number")
    .positive("Duration must be greater than 0"),
});

interface EditAssessmentFormProps {
  assessmentId: string;
}

export function EditAssessmentForm({
  assessmentId,
}: EditAssessmentFormProps) {
  const router = useRouter();

  console.log(assessmentId)

  const {
    data,
    isLoading,
    isError,
  } = useAssessment(assessmentId);

  const updateMutation =
    useUpdateAssessment();

  const assessment = data?.data;

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      duration: 30,
    },

    onSubmit: async ({ value }) => {
      const result =
        editAssessmentSchema.safeParse(value);

      if (!result.success) {
        return;
      }

      updateMutation.mutate(
        {
          assessmentId,
          payload: {
            title: result.data.title,
            description:
              result.data.description || undefined,
            duration: result.data.duration,
          },
        },
        {
          onSuccess: () => {
            router.push(
              `/assessments/${assessmentId}`,
            );

            router.refresh();
          },
        },
      );
    },
  });

  useEffect(() => {
    if (!assessment) {
      return;
    }

    form.setFieldValue(
      "title",
      assessment.title,
    );

    form.setFieldValue(
      "description",
      assessment.description ?? "",
    );

    form.setFieldValue(
      "duration",
      assessment.duration,
    );
  }, [assessment, form]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex min-h-60 items-center justify-center">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !assessment) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <p className="font-medium">
            Failed to load assessment
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            The assessment could not be found.
          </p>

          <Button
            className="mt-5"
            variant="outline"
            onClick={() =>
              router.push("/assessments")
            }
          >
            Back to assessments
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (assessment.status !== "DRAFT") {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <p className="font-medium">
            This assessment cannot be edited
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Only draft assessments can be updated.
          </p>

          <Button
            className="mt-5"
            variant="outline"
            onClick={() =>
              router.push(
                `/assessments/${assessmentId}`,
              )
            }
          >
            Back to assessment
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Assessment Details
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();

            form.handleSubmit();
          }}
          className="space-y-6"
        >
          {/* Title */}
          <form.Field
            name="title"
            validators={{
              onChange: ({ value }) => {
                const result =
                  editAssessmentSchema.shape.title.safeParse(
                    value,
                  );

                return result.success
                  ? undefined
                  : result.error.issues[0]
                      ?.message;
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title
                </Label>

                <Input
                  id="title"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) =>
                    field.handleChange(
                      event.target.value,
                    )
                  }
                  placeholder="e.g. Frontend Developer Assessment"
                />

                {field.state.meta.errors.length >
                  0 && (
                  <p className="text-sm text-destructive">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          {/* Description */}
          <form.Field
            name="description"
            validators={{
              onChange: ({ value }) => {
                const result =
                  editAssessmentSchema.shape.description.safeParse(
                    value,
                  );

                return result.success
                  ? undefined
                  : result.error.issues[0]
                      ?.message;
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="description">
                  Description
                </Label>

                <Textarea
                  id="description"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) =>
                    field.handleChange(
                      event.target.value,
                    )
                  }
                  placeholder="Describe this assessment..."
                  rows={5}
                />

                {field.state.meta.errors.length >
                  0 && (
                  <p className="text-sm text-destructive">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          {/* Duration */}
          <form.Field
            name="duration"
            validators={{
              onChange: ({ value }) => {
                const result =
                  editAssessmentSchema.shape.duration.safeParse(
                    value,
                  );

                return result.success
                  ? undefined
                  : result.error.issues[0]
                      ?.message;
              },
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="duration">
                  Duration (minutes)
                </Label>

                <Input
                  id="duration"
                  type="number"
                  min={1}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) =>
                    field.handleChange(
                      Number(event.target.value),
                    )
                  }
                />

                {field.state.meta.errors.length >
                  0 && (
                  <p className="text-sm text-destructive">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 border-t pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                router.push(
                  `/assessments/${assessmentId}`,
                )
              }
              disabled={
                updateMutation.isPending
              }
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                updateMutation.isPending
              }
            >
              {updateMutation.isPending && (
                <Loader2 className="mr-2 size-4 animate-spin" />
              )}

              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}