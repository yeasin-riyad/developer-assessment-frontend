import { z } from "zod";

export const createCompanySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Company name must be at least 2 characters")
    .max(150, "Company name must be less than 150 characters"),

  description: z
    .string()
    .trim()
    .max(
      1000,
      "Description must be less than 1000 characters",
    )
    .optional(),

  website: z
    .url("Please enter a valid website URL")
    .optional()
    .or(z.literal("")),

  logo: z
    .url("Please enter a valid logo URL")
    .optional()
    .or(z.literal("")),
});

export type CreateCompanyFormValues =
  z.infer<typeof createCompanySchema>;