"use client";

import type { FormApi } from "@tanstack/react-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";

import type { CreateProblemFormValues } from "@/features/problems";

interface MCQOptionsSectionProps {
  form: FormApi<CreateProblemFormValues>;
  disabled: boolean;
}

export function MCQOptionsSection({
  form,
  disabled,
}: MCQOptionsSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base">
          Answer Options
        </CardTitle>

        <CardDescription>
          Enter four options and select the correct answer.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form.Field name="options">
          {(field) => {
            const options = field.state.value ?? [];
            const error = field.state.meta.errors[0];

            const correctIndex = options.findIndex(
              (option) => option.isCorrect,
            );

            return (
              <div className="space-y-3">
                <RadioGroup
                  value={
                    correctIndex >= 0
                      ? String(correctIndex)
                      : undefined
                  }
                  onValueChange={(value) => {
                    const selectedIndex = Number(value);

                    field.handleChange(
                      options.map((option, index) => ({
                        ...option,
                        isCorrect:
                          index === selectedIndex,
                      })),
                    );
                  }}
                  disabled={disabled}
                  className="space-y-3"
                >
                  {options.map((option, index) => (
                    <div
                      key={index}
                      className="rounded-md border bg-background px-3 py-2.5"
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem
                          value={String(index)}
                          id={`correct-${index}`}
                        />

                        <span className="w-5 shrink-0 text-sm font-semibold text-muted-foreground">
                          {String.fromCharCode(65 + index)}
                        </span>

                        <div className="min-w-0 flex-1">
                          <Label
                            htmlFor={`option-${index}`}
                            className="sr-only"
                          >
                            Option {index + 1}
                          </Label>

                          <Input
                            id={`option-${index}`}
                            type="text"
                            placeholder={`Enter option ${index + 1}`}
                            value={option.text}
                            disabled={disabled}
                            onChange={(event) => {
                              field.handleChange(
                                options.map(
                                  (
                                    current,
                                    currentIndex,
                                  ) =>
                                    currentIndex === index
                                      ? {
                                          ...current,
                                          text: event.target
                                            .value,
                                        }
                                      : current,
                                ),
                              );
                            }}
                            className="h-9 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
                            aria-invalid={Boolean(
                              error,
                            )}
                          />
                        </div>

                        {option.isCorrect && (
                          <span className="shrink-0 text-xs font-medium text-primary">
                            Correct
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </RadioGroup>

                {error && (
                  <p className="text-sm text-destructive">
                    {String(error)}
                  </p>
                )}
              </div>
            );
          }}
        </form.Field>
      </CardContent>
    </Card>
  );
}