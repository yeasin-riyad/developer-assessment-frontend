"use client";

import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { Building2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  createCompanySchema,
  useCreateCompany,
  type CreateCompanyFormValues,
} from "@/features/company";

import { validateWithZod } from "@/lib/form-validation";

import { CompanyBasicInfo } from "./company-basic-info";

const defaultValues: CreateCompanyFormValues = {
  name: "",
  description: "",
  website: "",
  logo: "",
};

export function CompanyForm() {
  const router = useRouter();

  const createCompanyMutation =
    useCreateCompany();

  const form = useForm({
    defaultValues,

    validators: {
      onChange: ({ value }) =>
        validateWithZod(
          createCompanySchema,
          value,
        ),
    },

    onSubmit: async ({ value }) => {
      try {
        const payload = {
          name: value.name.trim(),

          ...(value.description?.trim()
            ? {
                description:
                  value.description.trim(),
              }
            : {}),

          ...(value.website?.trim()
            ? {
                website:
                  value.website.trim(),
              }
            : {}),

          ...(value.logo?.trim()
            ? {
                logo: value.logo.trim(),
              }
            : {}),
        };

        await createCompanyMutation.mutateAsync(
          payload,
        );

        router.push("/company");
      } catch {
        // API error is displayed below.
      }
    },
  });

  const isSubmitting =
    createCompanyMutation.isPending;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();

        form.handleSubmit();
      }}
      className="space-y-6"
    >
      <CompanyBasicInfo
        form={form}
        disabled={isSubmitting}
      />

      {createCompanyMutation.isError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3">
          <p className="text-sm font-medium text-destructive">
            {createCompanyMutation.error instanceof
            Error
              ? createCompanyMutation.error.message
              : "Failed to create company. Please try again."}
          </p>
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={() =>
            router.push("/company")
          }
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Building2 className="mr-2 size-4" />
              Create Company
            </>
          )}
        </Button>
      </div>
    </form>
  );
}