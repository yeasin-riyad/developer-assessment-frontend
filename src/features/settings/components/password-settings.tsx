
"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import {
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  ShieldCheck,
} from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { useChangeMyPassword, useMySettings } from "../useSettings";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password cannot exceed 128 characters"),
    confirmPassword: z.string().min(
      1,
      "Please confirm your new password",
    ),
  })
  .refine(
    (values) => values.newPassword === values.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    },
  )
  .refine(
    (values) => values.currentPassword !== values.newPassword,
    {
      message: "New password must differ from current password",
      path: ["newPassword"],
    },
  );

type PasswordFormValues = z.infer<typeof passwordSchema>;

export function PasswordSettings() {
  const { data: user, isLoading } = useMySettings();
  const changePassword = useChangeMyPassword();
  const [showPasswords, setShowPasswords] = useState(false);

  const form = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    } as PasswordFormValues,

    validators: {
      onSubmit: passwordSchema,
    },

    onSubmit: async ({ value }) => {
      changePassword.mutate(
        {
          currentPassword: value.currentPassword,
          newPassword: value.newPassword,
        },
        {
          onSuccess: () => {
            toast.success("Password changed successfully");
            form.reset();
          },
          onError: (error) => {
            toast.error(
              error instanceof Error
                ? error.message
                : "Failed to change password",
            );
          },
        },
      );
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center py-12">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (user && !user.isActive) {
    return (
      <Card>
        <CardContent className="py-6 text-sm text-muted-foreground">
          Password changes are unavailable because this account is inactive.
        </CardContent>
      </Card>
    );
  }

  if (user?.authProvider === "GOOGLE") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="size-5" />
            Password & Security
          </CardTitle>
          <CardDescription>
            Your account uses Google sign-in.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground">
            A local password setup or reset flow is required before
            you can manage a password here.
          </p>
        </CardContent>
      </Card>
    );
  }

  const fields = [
    {
      name: "currentPassword" as const,
      label: "Current password",
      autoComplete: "current-password",
    },
    {
      name: "newPassword" as const,
      label: "New password",
      autoComplete: "new-password",
    },
    {
      name: "confirmPassword" as const,
      label: "Confirm new password",
      autoComplete: "new-password",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <KeyRound className="size-5 text-primary" />
          </div>

          <div>
            <CardTitle>Password & Security</CardTitle>
            <CardDescription>
              Use a strong, unique password to protect your account.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void form.handleSubmit();
          }}
          className="space-y-5"
        >
          {fields.map((item) => (
            <form.Field
              key={item.name}
              name={item.name}
              validators={{
                onBlur: ({ value }) => {
                  const result = passwordSchema.shape[item.name].safeParse(
                    value,
                  );

                  return result.success
                    ? undefined
                    : result.error.issues[0]?.message;
                },
              }}
            >
              {(field) => {
                const hasError =
                  field.state.meta.isTouched &&
                  !field.state.meta.isValid;

                return (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>{item.label}</Label>

                    <div className="relative">
                      <Input
                        id={field.name}
                        name={field.name}
                        type={showPasswords ? "text" : "password"}
                        autoComplete={item.autoComplete}
                        className="pr-10"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                        aria-invalid={hasError}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPasswords((previous) => !previous)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        aria-label={
                          showPasswords ? "Hide passwords" : "Show passwords"
                        }
                      >
                        {showPasswords ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </button>
                    </div>

                    {hasError && (
                      <p className="text-sm text-destructive">
                        {field.state.meta.errors
                          .map((error) =>
                            typeof error === "string"
                              ? error
                              : error?.message,
                          )
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    )}
                  </div>
                );
              }}
            </form.Field>
          ))}

          <Separator />

          <div className="flex justify-end">
            <form.Subscribe
              selector={(state) => ({
                canSubmit: state.canSubmit,
                isSubmitting: state.isSubmitting,
              })}
            >
              {({ canSubmit, isSubmitting }) => (
                <Button
                  type="submit"
                  disabled={
                    !canSubmit ||
                    isSubmitting ||
                    changePassword.isPending
                  }
                >
                  {isSubmitting || changePassword.isPending ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  ) : (
                    <KeyRound className="mr-2 size-4" />
                  )}
                  Update Password
                </Button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}