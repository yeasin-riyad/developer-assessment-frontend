import type { z } from "zod";

export function validateWithZod<T>(
  schema: z.ZodType<T>,
  value: unknown,
): string | undefined {
  const result = schema.safeParse(value);

  if (result.success) {
    return undefined;
  }

  return result.error.issues[0]?.message;
}