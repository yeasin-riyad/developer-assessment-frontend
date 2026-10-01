import { z } from "zod";

import {
  UserRole,
  type RegisterFormValues,
} from "./types";

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be less than 100 characters"),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Please enter a valid email address"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password must be less than 100 characters"),

    confirmPassword: z.string(),

    role: z.enum([
      UserRole.CANDIDATE,
      UserRole.CREATOR,
    ]),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }
  });

export type RegisterSchema = z.infer<
  typeof registerSchema
>;

export const registerDefaultValues: RegisterFormValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: UserRole.CANDIDATE,
};