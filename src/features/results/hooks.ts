"use client";

import { useQuery } from "@tanstack/react-query";

import { getMyResult } from "./api";

export function useMyResult(
  attemptId: string,
) {
  return useQuery({
    queryKey: ["results", "attempt", attemptId],
    queryFn: () => getMyResult(attemptId),
    enabled: Boolean(attemptId),
  });
}