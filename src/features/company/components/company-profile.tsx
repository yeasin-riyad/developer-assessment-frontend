"use client";

import Link from "next/link";
import {
  Building2,
  ExternalLink,
  Loader2,
  Pencil,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import {
  CompanyStatus,
  useMyCompany,
} from "@/features/company";

export function CompanyProfile() {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useMyCompany();

  if (isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6">
        <p className="font-medium text-destructive">
          {error instanceof Error
            ? error.message
            : "Failed to load company"}
        </p>

        {error instanceof Error &&
          error.message === "Company not found" && (
            <Button
              className="mt-4"
              
            >
              <Link href="/company/create">
                Create Company
              </Link>
            </Button>
          )}
      </div>
    );
  }

  const company = data?.data;

  if (!company) {
    return null;
  }

  return (
    <Card className="overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              {company.logo ? (
                <img
                  src={company.logo}
                  alt={`${company.name} logo`}
                  className="size-14 rounded-xl object-cover"
                />
              ) : (
                <Building2 className="size-7 text-primary" />
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold">
                {company.name}
              </h2>

              <div className="mt-2 flex items-center gap-2">
                <span
                  className={
                    company.status ===
                    CompanyStatus.ACTIVE
                      ? "rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700"
                      : "rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700"
                  }
                >
                  {company.status}
                </span>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
        
          >
            <Link href="/company/edit">
              <Pencil className="mr-2 size-4" />
              Edit
            </Link>
          </Button>
        </div>

        {company.description && (
          <p className="mt-6 max-w-3xl text-sm leading-6 text-muted-foreground">
            {company.description}
          </p>
        )}

        {company.website && (
          <div className="mt-6">
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <ExternalLink className="size-4" />
              Visit company website
            </a>
          </div>
        )}
      </div>
    </Card>
  );
}