"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useMyCompany } from "@/features/company";
import { ApiError } from "@/lib/api";

export function AssessmentCreateGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useMyCompany();

  useEffect(() => {
    if (
      isError &&
      error instanceof ApiError &&
      error.statusCode === 404
    ) {
      router.replace("/company/create");
    }
  }, [isError, error, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="size-7 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    if (
      error instanceof ApiError &&
      error.statusCode === 404
    ) {
      return (
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Redirecting to company setup...
          </p>
        </div>
      );
    }

    return (
      <div className="mx-auto flex min-h-[400px] max-w-md flex-col items-center justify-center text-center">
        <h2 className="text-lg font-semibold">
          Unable to verify company
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          {error instanceof Error
            ? error.message
            : "Something went wrong. Please try again."}
        </p>

        <Button
          className="mt-5"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (!data?.data) {
    return null;
  }

  return <>{children}</>;
}