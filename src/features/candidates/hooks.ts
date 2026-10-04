"use client";

import { useQuery } from "@tanstack/react-query";

import { getCandidates } from "./api";

import type { CandidateQueryParams } from "./types";

export const candidateQueryKeys = {
  all: ["candidates"] as const,

  lists: () => [...candidateQueryKeys.all, "list"] as const,

  list: (params?: CandidateQueryParams) =>
    [...candidateQueryKeys.lists(), params] as const,
};

export function useCandidates(params?: CandidateQueryParams) {
  return useQuery({
    queryKey: candidateQueryKeys.list(params),
    queryFn: () => getCandidates(params),
  });
}