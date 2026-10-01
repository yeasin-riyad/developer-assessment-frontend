"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export default function OAuthSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      router.replace("/login?error=google-auth-failed");

      return;
    }

    localStorage.setItem("accessToken", token);

    // Remove token from browser URL.
    window.history.replaceState(
      {},
      "",
      "/oauth/success",
    );

    router.replace("/dashboard");
  }, [router, searchParams]);

  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
          <Loader2 className="size-8 animate-spin" />

          <div>
            <h2 className="font-semibold">
              Signing you in...
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Please wait while we complete your Google
              authentication.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}