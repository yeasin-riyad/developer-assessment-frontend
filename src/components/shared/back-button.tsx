
"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function BackButton() {
  const router = useRouter();

  return (
    <Button
      type="button"
      size="lg"
      onClick={() => router.back()}
      className="group gap-2 rounded-xl bg-indigo-600 px-6 text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-xl"
    >
      <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
      Go Back
    </Button>
  );
}
