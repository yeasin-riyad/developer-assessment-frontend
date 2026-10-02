import { z } from "zod";

export const createAssessmentSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be less than 200 characters"),

  description: z
    .string()
    .trim()
    .max(1000, "Description must be less than 1000 characters")
    .optional(),

  duration: z
    .number()
    .int("Duration must be a whole number")
    .positive("Duration must be greater than 0"),
});

export const updateAssessmentSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be less than 200 characters")
    .optional(),

  description: z
    .string()
    .trim()
    .max(1000, "Description must be less than 1000 characters")
    .optional(),

  duration: z
    .number()
    .int("Duration must be a whole number")
    .positive("Duration must be greater than 0")
    .optional(),
});

export const addProblemSchema = z.object({
  problemId: z.uuid("Invalid problem ID"),

  points: z
    .number()
    .int("Points must be a whole number")
    .positive("Points must be greater than 0"),

  order: z
    .number()
    .int("Order must be a whole number")
    .positive("Order must be greater than 0"),
});

export type CreateAssessmentFormValues = z.infer<
  typeof createAssessmentSchema
>;

export type UpdateAssessmentFormValues = z.infer<
  typeof updateAssessmentSchema
>;

export type AddProblemFormValues = z.infer<
  typeof addProblemSchema
>;