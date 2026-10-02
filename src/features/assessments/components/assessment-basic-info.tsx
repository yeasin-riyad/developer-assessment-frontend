"use client";

import type { AnyFormApi } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { CreateAssessmentFormValues } from "@/features/assessments";

interface AssessmentBasicInfoProps {
form: AnyFormApi;
  disabled: boolean;
}

export function AssessmentBasicInfo({
  form,
  disabled,
}: AssessmentBasicInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>

        <CardDescription>
          Provide the basic information for your assessment.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Title */}
        <form.Field name="title">
          {(field) => {
            const error = field.state.meta.errors[0];

            return (
              <div className="space-y-2">
                <Label htmlFor="title">
                  Assessment Title
                </Label>

                <Input
                  id="title"
                  placeholder="e.g. Backend Developer Assessment"
                  value={field.state.value}
                  disabled={disabled}
                  onBlur={field.handleBlur}
                  onChange={(event) =>
                    field.handleChange(
                      event.target.value,
                    )
                  }
                  aria-invalid={Boolean(error)}
                />

                <div className="flex items-center justify-between">
                  {error ? (
                    <p className="text-sm text-destructive">
                      {String(error)}
                    </p>
                  ) : (
                    <span />
                  )}

                  <span className="text-xs text-muted-foreground">
                    {field.state.value.length}/200
                  </span>
                </div>
              </div>
            );
          }}
        </form.Field>

        {/* Description */}
        <form.Field name="description">
          {(field) => {
            const error = field.state.meta.errors[0];

            return (
              <div className="space-y-2">
                <Label htmlFor="description">
                  Description
                </Label>

                <Textarea
                  id="description"
                  placeholder="Describe what this assessment is designed to evaluate..."
                  rows={6}
                  value={field.state.value ?? ""}
                  disabled={disabled}
                  onBlur={field.handleBlur}
                  onChange={(event) =>
                    field.handleChange(
                      event.target.value,
                    )
                  }
                  aria-invalid={Boolean(error)}
                />

                <div className="flex items-center justify-between">
                  {error ? (
                    <p className="text-sm text-destructive">
                      {String(error)}
                    </p>
                  ) : (
                    <span />
                  )}

                  <span className="text-xs text-muted-foreground">
                    {(field.state.value ?? "").length}/1000
                  </span>
                </div>
              </div>
            );
          }}
        </form.Field>

        {/* Duration */}
        <form.Field name="duration">
          {(field) => {
            const error = field.state.meta.errors[0];

            return (
              <div className="max-w-xs space-y-2">
                <Label htmlFor="duration">
                  Duration
                </Label>

                <div className="relative">
                  <Input
                    id="duration"
                    type="number"
                    min={1}
                    placeholder="60"
                    value={field.state.value}
                    disabled={disabled}
                    onBlur={field.handleBlur}
                    onChange={(event) => {
                      const value = event.target.value;

                      field.handleChange(
                        value === ""
                          ? 0
                          : Number(value),
                      );
                    }}
                    aria-invalid={Boolean(error)}
                    className="pr-16"
                  />

                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    minutes
                  </span>
                </div>

                {error && (
                  <p className="text-sm text-destructive">
                    {String(error)}
                  </p>
                )}

                <p className="text-xs text-muted-foreground">
                  Candidates will have this amount of time
                  to complete the assessment.
                </p>
              </div>
            );
          }}
        </form.Field>
      </CardContent>
    </Card>
  );
}