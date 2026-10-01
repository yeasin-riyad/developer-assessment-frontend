"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { Loader2 } from "lucide-react";

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

import {
  AuthDivider,
  GoogleButton,
} from "@/components/auth";

import {
  loginDefaultValues,
  loginSchema,
  useLogin,
  type LoginFormValues,
} from "@/features/auth";

import { validateWithZod } from "@/lib/form-validation";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const loginMutation = useLogin();

  const registered = searchParams.get("registered");

  const form = useForm({
    defaultValues:
      loginDefaultValues satisfies LoginFormValues,

    validators: {
      onChange: ({ value }) =>
        validateWithZod(loginSchema, value),
    },

    onSubmit: async ({ value }) => {
      try {
        const response =
          await loginMutation.mutateAsync({
            email: value.email,
            password: value.password,
          });

        if (response.data.accessToken) {
          localStorage.setItem(
            "accessToken",
            response.data.accessToken,
          );
        }

        router.push("/dashboard");
      } catch (error) {
        console.error("Login failed:", error);
      }
    },
  });

  const isSubmitting = loginMutation.isPending;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-6">
      <Card className="w-full max-w-md border-border/60 shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Welcome back
          </CardTitle>

          <CardDescription>
            Sign in to continue to your DevAssess account.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-5">
            {registered === "true" && (
              <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3">
                <p className="text-sm text-green-700 dark:text-green-400">
                  Account created successfully. Please sign
                  in to continue.
                </p>
              </div>
            )}

            <GoogleButton />

            <AuthDivider />

            <form
              onSubmit={(event) => {
                event.preventDefault();
                event.stopPropagation();

                form.handleSubmit();
              }}
              className="space-y-4"
            >
              {/* Email */}
              <form.Field name="email">
                {(field) => {
                  const error =
                    field.state.meta.errors[0];

                  return (
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email
                      </Label>

                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        value={field.state.value}
                        disabled={isSubmitting}
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

              {/* Password */}
              <form.Field name="password">
                {(field) => {
                  const error =
                    field.state.meta.errors[0];

                  return (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">
                          Password
                        </Label>

                        {/* <Link
                          href="/forgot-password"
                          className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                        >
                          Forgot password?
                        </Link> */}
                      </div>

                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        value={field.state.value}
                        disabled={isSubmitting}
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

              {/* Backend Error */}
              {loginMutation.isError && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3">
                  <p className="text-sm text-destructive">
                    {loginMutation.error instanceof
                    Error
                      ? loginMutation.error.message
                      : "Invalid email or password. Please try again."}
                  </p>
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                className="h-10 w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

            {/* Register */}
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Create account
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}