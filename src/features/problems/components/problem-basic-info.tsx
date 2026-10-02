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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";

import {
  ProblemDifficulty,
  ProblemType,
} from "@/features/problems";

interface ProblemBasicInfoProps {
  form: ReturnType<typeof useForm>;
  disabled: boolean;
}

export function ProblemBasicInfo({
  form,
  disabled,
}: ProblemBasicInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Basic Information
        </CardTitle>

        <CardDescription>
          Define the basic information for your
          problem.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Title */}
        <form.Field name="title">
          {(field) => {
            const error =
              field.state.meta.errors[0];

            return (
              <div className="space-y-2">
                <Label htmlFor="title">
                  Problem Title
                </Label>

                <Input
                  id="title"
                  placeholder="e.g. What is the time complexity of binary search?"
                  value={field.state.value}
                  disabled={disabled}
                  onBlur={field.handleBlur}
                  onChange={(event) =>
                    field.handleChange(
                      event.target.value,
                    )
                  }
                />

                {error && (
                  <p className="text-sm text-destructive">
                    {error}
                  </p>
                )}
              </div>
            );
          }}
        </form.Field>

        {/* Description */}
        <form.Field name="description">
          {(field) => {
            const error =
              field.state.meta.errors[0];

            return (
              <div className="space-y-2">
                <Label htmlFor="description">
                  Question / Description
                </Label>

                <Textarea
                  id="description"
                  placeholder="Write the question clearly..."
                  rows={6}
                  value={field.state.value}
                  disabled={disabled}
                  onBlur={field.handleBlur}
                  onChange={(event) =>
                    field.handleChange(
                      event.target.value,
                    )
                  }
                />

                {error && (
                  <p className="text-sm text-destructive">
                    {error}
                  </p>
                )}
              </div>
            );
          }}
        </form.Field>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Type */}
          <form.Field name="type">
            {(field) => (
              <div className="space-y-2">
                <Label>
                  Problem Type
                </Label>

                <Select
                  value={field.state.value}
                  disabled={disabled}
                  onValueChange={(value) =>
                    field.handleChange(
                      value as ProblemType,
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="MCQ">
                      Multiple Choice
                    </SelectItem>

                    <SelectItem value="WRITTEN">
                      Written
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </form.Field>

          {/* Difficulty */}
          <form.Field name="difficulty">
            {(field) => (
              <div className="space-y-2">
                <Label>
                  Difficulty
                </Label>

                <Select
                  value={field.state.value}
                  disabled={disabled}
                  onValueChange={(value) =>
                    field.handleChange(
                      value as ProblemDifficulty,
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="EASY">
                      Easy
                    </SelectItem>

                    <SelectItem value="MEDIUM">
                      Medium
                    </SelectItem>

                    <SelectItem value="HARD">
                      Hard
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </form.Field>

          {/* Points */}
          <form.Field name="points">
            {(field) => {
              const error =
                field.state.meta.errors[0];

              return (
                <div className="space-y-2">
                  <Label htmlFor="points">
                    Points
                  </Label>

                  <Input
                    id="points"
                    type="number"
                    min={1}
                    value={field.state.value}
                    disabled={disabled}
                    onBlur={field.handleBlur}
                    onChange={(event) =>
                      field.handleChange(
                        Number(
                          event.target.value,
                        ),
                      )
                    }
                  />

                  {error && (
                    <p className="text-sm text-destructive">
                      {error}
                    </p>
                  )}
                </div>
              );
            }}
          </form.Field>
        </div>
      </CardContent>
    </Card>
  );
}