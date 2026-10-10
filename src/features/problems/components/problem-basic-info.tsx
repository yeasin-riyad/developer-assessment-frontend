
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";

import {
  ProblemDifficulty,
  type CreateProblemFormValues,
} from "@/features/problems";

interface ProblemBasicInfoProps {
  form: FormApi<CreateProblemFormValues>;
  disabled: boolean;
}

export function ProblemBasicInfo({
  form,
  disabled,
}: ProblemBasicInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>

        <CardDescription>
          Define the title, question, difficulty, and points for your MCQ.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Title */}
        <form.Field name="title">
          {(field) => {
            const error = field.state.meta.errors[0];

            return (
              <div className="space-y-2">
                <Label htmlFor="title">Problem Title</Label>

                <Input
                  id="title"
                  placeholder="e.g. What is the time complexity of binary search?"
                  value={field.state.value}
                  disabled={disabled}
                  onBlur={field.handleBlur}
                  onChange={(event) =>
                    field.handleChange(event.target.value)
                  }
                  aria-invalid={Boolean(error)}
                />

                {error && (
                  <p className="text-sm text-destructive">
                    {String(error)}
                  </p>
                )}
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
                  Question / Description
                </Label>

                <Textarea
                  id="description"
                  placeholder="Write the MCQ question clearly..."
                  rows={6}
                  value={field.state.value}
                  disabled={disabled}
                  onBlur={field.handleBlur}
                  onChange={(event) =>
                    field.handleChange(event.target.value)
                  }
                  aria-invalid={Boolean(error)}
                />

                {error && (
                  <p className="text-sm text-destructive">
                    {String(error)}
                  </p>
                )}
              </div>
            );
          }}
        </form.Field>

        {/* Difficulty and Points */}
        <div className="grid gap-6 sm:grid-cols-2">
          {/* Difficulty */}
          <form.Field name="difficulty">
            {(field) => {
              const error = field.state.meta.errors[0];

              return (
                <div className="space-y-2">
                  <Label>Difficulty</Label>

                  <Select
                    value={field.state.value}
                    disabled={disabled}
                    onValueChange={(value) =>
                      field.handleChange(value as ProblemDifficulty)
                    }
                  >
                    <SelectTrigger aria-invalid={Boolean(error)}>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="EASY">Easy</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HARD">Hard</SelectItem>
                    </SelectContent>
                  </Select>

                  {error && (
                    <p className="text-sm text-destructive">
                      {String(error)}
                    </p>
                  )}
                </div>
              );
            }}
          </form.Field>

          {/* Points */}
          <form.Field name="points">
            {(field) => {
              const error = field.state.meta.errors[0];

              return (
                <div className="space-y-2">
                  <Label htmlFor="points">Points</Label>

                  <Input
                    id="points"
                    type="number"
                    min={1}
                    step={1}
                    value={field.state.value}
                    disabled={disabled}
                    onBlur={field.handleBlur}
                    onChange={(event) => {
                      const value = event.target.value;

                      if (value !== "") {
                        field.handleChange(Number(value));
                      }
                    }}
                    aria-invalid={Boolean(error)}
                  />

                  {error && (
                    <p className="text-sm text-destructive">
                      {String(error)}
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

