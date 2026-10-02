"use client";

import { useForm } from "@tanstack/react-form";

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

interface MCQOptionsSectionProps {
  form: ReturnType<typeof useForm>;
  disabled: boolean;
}

export function MCQOptionsSection({
  form,
  disabled,
}: MCQOptionsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Answer Options
        </CardTitle>

        <CardDescription>
          Add exactly four options and select
          exactly one correct answer.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form.Field name="options">
          {(field) => {
            const options =
              field.state.value ?? [];

            const error =
              field.state.meta.errors[0];

            return (
              <div className="space-y-4">
                {options.map(
                  (option, index) => (
                    <div
                      key={index}
                      className="rounded-lg border p-4"
                    >
                      <div className="flex items-start gap-4">
                        {/* Correct Answer */}
                        <RadioGroup
                          value={
                            option.isCorrect
                              ? String(index)
                              : ""
                          }
                          onValueChange={() => {
                            field.handleChange(
                              options.map(
                                (
                                  current,
                                  currentIndex,
                                ) => ({
                                  ...current,
                                  isCorrect:
                                    currentIndex ===
                                    index,
                                }),
                              ),
                            );
                          }}
                          disabled={disabled}
                          className="pt-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value={String(index)}
                              id={`correct-${index}`}
                            />

                            <Label
                              htmlFor={`correct-${index}`}
                              className="text-xs text-muted-foreground"
                            >
                              Correct
                            </Label>
                          </div>
                        </RadioGroup>

                        {/* Option Text */}
                        <div className="flex-1 space-y-2">
                          <Label
                            htmlFor={`option-${index}`}
                          >
                            Option {index + 1}
                          </Label>

                          <Input
                            id={`option-${index}`}
                            placeholder={`Enter option ${
                              index + 1
                            }`}
                            value={option.text}
                            disabled={disabled}
                            onChange={(event) => {
                              field.handleChange(
                                options.map(
                                  (
                                    current,
                                    currentIndex,
                                  ) =>
                                    currentIndex ===
                                    index
                                      ? {
                                          ...current,
                                          text: event
                                            .target
                                            .value,
                                        }
                                      : current,
                                ),
                              );
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ),
                )}

                {error && (
                  <p className="text-sm text-destructive">
                    {error}
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