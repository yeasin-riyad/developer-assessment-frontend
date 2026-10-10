
"use client";

import { useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { Loader2, Save, UserRound } from "lucide-react";
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
import { useMySettings, useUpdateMyProfile } from "../useSettings";

const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileSettings() {
  const { data: user, isLoading, isError } = useMySettings();
  const updateProfile = useUpdateMyProfile();

  const form = useForm({
    defaultValues: {
      name: "",
    } as ProfileFormValues,

    validators: {
      onSubmit: profileSchema,
    },

    onSubmit: async ({ value }) => {
      updateProfile.mutate(value, {
        onSuccess: (updatedUser) => {
          toast.success("Profile updated successfully");

          form.reset({
            name: updatedUser.name,
          });
        },

        onError: (error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to update profile",
          );
        },
      });
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
      });
    }
  }, [user?.id, user?.name]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !user) {
    return (
      <Card>
        <CardContent className="py-8 text-sm text-destructive">
          Failed to load your profile. Please refresh and try again.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <UserRound className="size-5 text-primary" />
          </div>

          <div>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update the name associated with your account.
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
          <form.Field
            name="name"
            validators={{
              onChange: profileSchema.shape.name,
              onBlur: profileSchema.shape.name,
            }}
          >
            {(field) => {
              const hasError =
                field.state.meta.isTouched &&
                !field.state.meta.isValid;

              return (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Full name</Label>

                  <Input
                    id={field.name}
                    name={field.name}
                    placeholder="Enter your name"
                    autoComplete="name"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) =>
                      field.handleChange(event.target.value)
                    }
                    aria-invalid={hasError}
                  />

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

          <div className="space-y-2">
            <Label htmlFor="profile-email">Email address</Label>

            <Input
              id="profile-email"
              type="email"
              value={user.email}
              readOnly
              disabled
            />

            <p className="text-xs text-muted-foreground">
              Email changes require a separate verification process.
            </p>
          </div>

          <div className="flex justify-end">
            <form.Subscribe
              selector={(state) => ({
                canSubmit: state.canSubmit,
                isDirty: state.isDirty,
                isSubmitting: state.isSubmitting,
              })}
            >
              {({ canSubmit, isDirty, isSubmitting }) => (
                <Button
                  type="submit"
                  disabled={
                    !isDirty ||
                    !canSubmit ||
                    isSubmitting ||
                    updateProfile.isPending
                  }
                >
                  {isSubmitting || updateProfile.isPending ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 size-4" />
                  )}

                  Save Changes
                </Button>
              )}
            </form.Subscribe>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}