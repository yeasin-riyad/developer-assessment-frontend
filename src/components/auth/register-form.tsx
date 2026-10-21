"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { AuthDivider, GoogleButton } from "@/components/auth";

import {
  registerDefaultValues,
  registerSchema,
  UserRole,
  useRegister,
  type RegisterFormValues,
} from "@/features/auth";

export function RegisterForm() {
  const router = useRouter();

  const registerMutation = useRegister();

  const form = useForm({
    defaultValues: registerDefaultValues satisfies RegisterFormValues,

    validators: {
      // Form-level validation — blocks submit when invalid and
      // surfaces inline errors on every field.
      onSubmit: ({ value }) => {
        const result = registerSchema.safeParse(value);

        if (result.success) return undefined;

        return result.error.issues.reduce<Record<string, string>>(
          (errors, issue) => {
            const path = issue.path.join(".");

            if (path && !errors[path]) {
              errors[path] = issue.message;
            }

            return errors;
          },
          {},
        );
      },
    },

    onSubmit: async ({ value }) => {
      // If we reach here, form-level validation passed.
      try {
        await registerMutation.mutateAsync({
          name: value.name,
          email: value.email,
          password: value.password,
          role: value.role,
        });

        toast.success("Account created successfully", {
          description: "Please sign in to continue.",
        });

        router.push("/login?registered=true");
      } catch (error) {
        toast.error("Registration failed", {
          description:
            error instanceof Error
              ? error.message
              : "Something went wrong. Please try again.",
        });

        console.error("Registration failed:", error);
      }
    },
  });

  const isSubmitting = registerMutation.isPending;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-6">
      <Card className="w-full max-w-4xl border-border/60 shadow-lg">
        <CardHeader className="space-y-2 pb-5 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Create your account
          </CardTitle>

          <CardDescription>
            Join DevAssess and start building better developer assessments.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="mx-auto w-full max-w-2xl space-y-5">
            {/* Google */}
            <GoogleButton />

            {/* Divider */}
            <AuthDivider />

            {/* Form */}
            <form
              noValidate
              onSubmit={(event) => {
                event.preventDefault();
                event.stopPropagation();

                form.handleSubmit();
              }}
              className="space-y-4"
            >
              {/* ========================= */}
              {/* Name + Email */}
              {/* ========================= */}

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Name */}
                <form.Field
                  name="name"
                  validators={{
                    onBlur: ({ value }) => {
                      const result =
                        registerSchema.shape.name.safeParse(value);

                      if (result.success) return undefined;

                      return (
                        result.error.issues[0]?.message ?? "Invalid name"
                      );
                    },
                    onChange: ({ value }) => {
                      const result =
                        registerSchema.shape.name.safeParse(value);

                      if (result.success) return undefined;

                      return (
                        result.error.issues[0]?.message ?? "Invalid name"
                      );
                    },
                  }}
                >
                  {(field) => {
                    const error =
                      field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0
                        ? field.state.meta.errors[0]
                        : null;

                    return (
                      <div className="space-y-2">
                        <Label htmlFor="name">Full name</Label>

                        <Input
                          id="name"
                          name="name"
                          placeholder="John Doe"
                          autoComplete="name"
                          value={field.state.value}
                          disabled={isSubmitting}
                          aria-invalid={Boolean(error)}
                          aria-describedby={
                            error ? "name-error" : undefined
                          }
                          onBlur={field.handleBlur}
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
                        />

                        {error && (
                          <p
                            id="name-error"
                            role="alert"
                            className="text-sm text-destructive"
                          >
                            {error}
                          </p>
                        )}
                      </div>
                    );
                  }}
                </form.Field>

                {/* Email */}
                <form.Field
                  name="email"
                  validators={{
                    onBlur: ({ value }) => {
                      const result =
                        registerSchema.shape.email.safeParse(value);

                      if (result.success) return undefined;

                      return (
                        result.error.issues[0]?.message ??
                        "Invalid email"
                      );
                    },
                    onChange: ({ value }) => {
                      const result =
                        registerSchema.shape.email.safeParse(value);

                      if (result.success) return undefined;

                      return (
                        result.error.issues[0]?.message ??
                        "Invalid email"
                      );
                    },
                  }}
                >
                  {(field) => {
                    const error =
                      field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0
                        ? field.state.meta.errors[0]
                        : null;

                    return (
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>

                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          autoComplete="email"
                          value={field.state.value}
                          disabled={isSubmitting}
                          aria-invalid={Boolean(error)}
                          aria-describedby={
                            error ? "email-error" : undefined
                          }
                          onBlur={field.handleBlur}
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
                        />

                        {error && (
                          <p
                            id="email-error"
                            role="alert"
                            className="text-sm text-destructive"
                          >
                            {error}
                          </p>
                        )}
                      </div>
                    );
                  }}
                </form.Field>
              </div>

              {/* ========================= */}
              {/* Role */}
              {/* ========================= */}

              <form.Field
                name="role"
                validators={{
                  onBlur: ({ value }) => {
                    const result =
                      registerSchema.shape.role.safeParse(value);

                    if (result.success) return undefined;

                    return (
                      result.error.issues[0]?.message ??
                      "Please select a role"
                    );
                  },
                  onChange: ({ value }) => {
                    const result =
                      registerSchema.shape.role.safeParse(value);

                    if (result.success) return undefined;

                    return (
                      result.error.issues[0]?.message ??
                      "Please select a role"
                    );
                  },
                }}
              >
                {(field) => {
                  const error =
                    field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0
                      ? field.state.meta.errors[0]
                      : null;

                  return (
                    <div className="space-y-2">
                      <div>
                        <Label>I want to join as</Label>

                        <p className="text-xs text-muted-foreground">
                          Choose how you will use the platform.
                        </p>
                      </div>

                      <RadioGroup
                        value={field.state.value}
                        onValueChange={(value) => {
                          field.handleChange(value as UserRole);
                        }}
                        disabled={isSubmitting}
                        className="grid gap-3 sm:grid-cols-2"
                      >
                        {/* Candidate */}
                        <label
                          htmlFor="candidate"
                          className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                        >
                          <RadioGroupItem
                            value={UserRole.CANDIDATE}
                            id="candidate"
                            className="mt-0.5"
                          />

                          <div className="space-y-0.5">
                            <p className="text-sm font-medium">
                              Candidate
                            </p>

                            <p className="text-xs text-muted-foreground">
                              Take assessments and view your results.
                            </p>
                          </div>
                        </label>

                        {/* Creator */}
                        <label
                          htmlFor="creator"
                          className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
                        >
                          <RadioGroupItem
                            value={UserRole.CREATOR}
                            id="creator"
                            className="mt-0.5"
                          />

                          <div className="space-y-0.5">
                            <p className="text-sm font-medium">Creator</p>

                            <p className="text-xs text-muted-foreground">
                              Create and manage developer problems.
                            </p>
                          </div>
                        </label>
                      </RadioGroup>

                      {error && (
                        <p
                          role="alert"
                          className="text-sm text-destructive"
                        >
                          {error}
                        </p>
                      )}
                    </div>
                  );
                }}
              </form.Field>

              {/* ========================= */}
              {/* Password + Confirm */}
              {/* ========================= */}

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Password */}
                <form.Field
                  name="password"
                  validators={{
                    onBlur: ({ value }) => {
                      const result =
                        registerSchema.shape.password.safeParse(value);

                      if (result.success) return undefined;

                      return (
                        result.error.issues[0]?.message ??
                        "Invalid password"
                      );
                    },
                    onChange: ({ value, fieldApi }) => {
                      const result =
                        registerSchema.shape.password.safeParse(value);

                      // Re-validate confirmPassword when password changes
                      // so a stale "match" doesn't persist.
                      const confirmField = form.getFieldInfo(
                        "confirmPassword",
                      );

                      if (
                        confirmField &&
                        form.getFieldValue("confirmPassword")
                      ) {
                        form.validateField("confirmPassword", "change");
                      }

                      if (result.success) return undefined;

                      return (
                        result.error.issues[0]?.message ??
                        "Invalid password"
                      );
                    },
                  }}
                >
                  {(field) => {
                    const error =
                      field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0
                        ? field.state.meta.errors[0]
                        : null;

                    return (
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>

                        <Input
                          id="password"
                          name="password"
                          type="password"
                          placeholder="••••••••"
                          autoComplete="new-password"
                          value={field.state.value}
                          disabled={isSubmitting}
                          aria-invalid={Boolean(error)}
                          aria-describedby={
                            error ? "password-error" : undefined
                          }
                          onBlur={field.handleBlur}
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
                        />

                        {error && (
                          <p
                            id="password-error"
                            role="alert"
                            className="text-sm text-destructive"
                          >
                            {error}
                          </p>
                        )}
                      </div>
                    );
                  }}
                </form.Field>

                {/* Confirm Password */}
                <form.Field
                  name="confirmPassword"
                  validators={{
                    onBlur: ({ value }) => {
                      if (!value) {
                        return "Please confirm your password";
                      }

                      if (value !== form.getFieldValue("password")) {
                        return "Passwords do not match";
                      }

                      return undefined;
                    },
                    onChange: ({ value }) => {
                      if (!value) {
                        return "Please confirm your password";
                      }

                      if (value !== form.getFieldValue("password")) {
                        return "Passwords do not match";
                      }

                      return undefined;
                    },
                  }}
                >
                  {(field) => {
                    const error =
                      field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0
                        ? field.state.meta.errors[0]
                        : null;

                    return (
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                          Confirm password
                        </Label>

                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          placeholder="••••••••"
                          autoComplete="new-password"
                          value={field.state.value}
                          disabled={isSubmitting}
                          aria-invalid={Boolean(error)}
                          aria-describedby={
                            error ? "confirm-password-error" : undefined
                          }
                          onBlur={field.handleBlur}
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
                        />

                        {error && (
                          <p
                            id="confirm-password-error"
                            role="alert"
                            className="text-sm text-destructive"
                          >
                            {error}
                          </p>
                        )}
                      </div>
                    );
                  }}
                </form.Field>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="h-10 w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </Button>
            </form>

            {/* Login */}
            <p className="pt-1 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}