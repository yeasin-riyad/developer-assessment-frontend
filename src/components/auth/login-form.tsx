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
import { setAccessToken } from "@/lib/auth";

const DEMO_ACCOUNTS = [
  {
    label: "Recruiter",
    email: "recruiter@gmail.com",
    password: "12345678",
  },
  {
    label: "Creator",
    email: "creator@gmail.com",
    password: "12345678",
  },
  {
    label: "Admin",
    email: "admin@example.com",
    password: "12345678",
  },
  {
    label: "Evaluator",
    email: "evaluator@gmail.com",
    password: "12345678",
  },
] as const;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const loginMutation = useLogin();

  const registered =
    searchParams.get("registered");

  const form = useForm({
    defaultValues:
      loginDefaultValues satisfies LoginFormValues,

    validators: {
      onChange: ({ value }) =>
        validateWithZod(
          loginSchema,
          value,
        ),
    },

    onSubmit: async ({ value }) => {
      await handleLogin(
        value.email,
        value.password,
      );
    },
  });

  const handleLogin = async (
    email: string,
    password: string,
  ) => {
    try {
      const response =
        await loginMutation.mutateAsync({
          email,
          password,
        });

        console.log(response,"RES")

      const accessToken =
        response.data.accessToken;

      if (!accessToken) {
        throw new Error(
          "Access token was not returned",
        );
      }

      setAccessToken(accessToken);

      /**
       * Notify AuthProvider that
       * authentication state changed.
       */
      window.dispatchEvent(
        new Event("auth:changed"),
      );
      

      router.replace("/dashboard");
    } catch (error) {
      console.error(
        "Login failed:",
        error,
      );
    }
  };

  const handleDemoLogin = async (
    email: string,
    password: string,
  ) => {
    await handleLogin(email, password);
  };

  const isSubmitting =
    loginMutation.isPending;

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

            {/* Registered Message */}
            {registered === "true" && (
              <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3">
                <p className="text-sm text-green-700 dark:text-green-400">
                  Account created successfully.
                  Please sign in to continue.
                </p>
              </div>
            )}

            {/* Google Login */}
            <GoogleButton />

            <AuthDivider />

            {/* Login Form */}
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
                      <Label htmlFor="password">
                        Password
                      </Label>

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
                    {loginMutation.error instanceof Error
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

            {/* Demo Accounts */}
            <div className="space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>

                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Demo accounts
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {DEMO_ACCOUNTS.map((account) => (
                  <Button
                    key={account.email}
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isSubmitting}
                    onClick={() =>
                      handleDemoLogin(
                        account.email,
                        account.password,
                      )
                    }
                  >
                    {isSubmitting ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      `Login as ${account.label}`
                    )}
                  </Button>
                ))}
              </div>
            </div>

            {/* Register */}
            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}

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