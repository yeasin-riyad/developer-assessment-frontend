"use client";

import type { FormApi } from "@tanstack/react-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import type { CreateCompanyFormValues } from "@/features/company";

interface CompanyBasicInfoProps {
  form: FormApi<CreateCompanyFormValues>;
  disabled?: boolean;
}

export function CompanyBasicInfo({
  form,
  disabled = false,
}: CompanyBasicInfoProps) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">
          Company Information
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Add your company details so candidates can
          identify your organization.
        </p>
      </div>

      <div className="space-y-5">
        {/* Company Name */}
        <form.Field name="name">
          {(field) => {
            const error =
              field.state.meta.errors[0];

            return (
              <div className="space-y-2">
                <Label htmlFor="company-name">
                  Company Name
                  <span className="ml-1 text-destructive">
                    *
                  </span>
                </Label>

                <Input
                  id="company-name"
                  placeholder="e.g. TechNova Solutions"
                  value={field.state.value}
                  disabled={disabled}
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

        {/* Description */}
        <form.Field name="description">
          {(field) => {
            const error =
              field.state.meta.errors[0];

            return (
              <div className="space-y-2">
                <Label htmlFor="company-description">
                  Description
                </Label>

                <Textarea
                  id="company-description"
                  placeholder="Tell candidates about your company..."
                  className="min-h-32 resize-none"
                  value={field.state.value ?? ""}
                  disabled={disabled}
                  onBlur={field.handleBlur}
                  onChange={(event) =>
                    field.handleChange(
                      event.target.value,
                    )
                  }
                />

                <div className="flex justify-between">
                  {error ? (
                    <p className="text-sm text-destructive">
                      {error}
                    </p>
                  ) : (
                    <span />
                  )}

                  <span className="text-xs text-muted-foreground">
                    {(field.state.value ?? "").length}/1000
                  </span>
                </div>
              </div>
            );
          }}
        </form.Field>

        {/* Website */}
        <form.Field name="website">
          {(field) => {
            const error =
              field.state.meta.errors[0];

            return (
              <div className="space-y-2">
                <Label htmlFor="company-website">
                  Website
                </Label>

                <Input
                  id="company-website"
                  type="url"
                  placeholder="https://example.com"
                  value={field.state.value ?? ""}
                  disabled={disabled}
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

        {/* Logo */}
        <form.Field name="logo">
          {(field) => {
            const error =
              field.state.meta.errors[0];

            return (
              <div className="space-y-2">
                <Label htmlFor="company-logo">
                  Logo URL
                </Label>

                <Input
                  id="company-logo"
                  type="url"
                  placeholder="https://example.com/logo.png"
                  value={field.state.value ?? ""}
                  disabled={disabled}
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
      </div>
    </div>
  );
}