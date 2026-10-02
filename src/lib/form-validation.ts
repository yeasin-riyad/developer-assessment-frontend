import type { z } from "zod";

export function validateWithZod<T>(
  schema: z.ZodType<T>,
  value: unknown,
) {
  const result = schema.safeParse(value);

  if (result.success) {
    return undefined;
  }

  return result.error.issues.reduce(
    (errors, issue) => {
      const path = issue.path.join(".");

      if (!errors[path]) {
        errors[path] = issue.message;
      }

      return errors;
    },
    {} as Record<string, string>,
  );
}