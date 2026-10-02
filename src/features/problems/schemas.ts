import { z } from "zod";

import {
  ProblemDifficulty,
  ProblemType,
} from "./types";

const optionSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, "Option text is required"),

  isCorrect: z.boolean(),
});

export const createProblemSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(
        3,
        "Title must be at least 3 characters",
      )
      .max(
        200,
        "Title must be less than 200 characters",
      ),

    description: z
      .string()
      .trim()
      .min(
        10,
        "Question must be at least 10 characters",
      ),

    type: z.nativeEnum(ProblemType),

    difficulty: z.nativeEnum(
      ProblemDifficulty,
    ),

    points: z
      .number()
      .int()
      .positive(
        "Points must be greater than 0",
      ),

    options: z
      .array(optionSchema)
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === ProblemType.MCQ) {
      if (
        !data.options ||
        data.options.length !== 4
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["options"],
          message:
            "MCQ must have exactly 4 options",
        });
      }

      const correctCount =
        data.options?.filter(
          (option) => option.isCorrect,
        ).length ?? 0;

      if (correctCount !== 1) {
        ctx.addIssue({
          code: "custom",
          path: ["options"],
          message:
            "MCQ must have exactly one correct answer",
        });
      }
    }

    if (
      data.type === ProblemType.WRITTEN &&
      data.options &&
      data.options.length > 0
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["options"],
        message:
          "Written problems cannot have options",
      });
    }
  });

export type CreateProblemFormValues =
  z.infer<typeof createProblemSchema>;