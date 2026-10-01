"use client";

import { Globe } from "lucide-react";

import { Button } from "@/components/ui/button";

export function GoogleButton() {
  const handleGoogleLogin = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      console.error(
        "NEXT_PUBLIC_API_URL is not configured",
      );

      return;
    }

    window.location.href = `${apiUrl}/auth/google`;
  };

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={handleGoogleLogin}
    >
      <Globe className="mr-2 size-4" />

      Continue with Google
    </Button>
  );
}