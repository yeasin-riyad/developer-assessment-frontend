"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createCompany,
  getMyCompany,
} from "./api";

import type { CreateCompanyPayload } from "./types";

export const companyQueryKeys = {
  all: ["company"] as const,

  me: () =>
    [...companyQueryKeys.all, "me"] as const,
};

export function useMyCompany() {
  return useQuery({
    queryKey: companyQueryKeys.me(),
    queryFn: getMyCompany,
  });
}

export function useCreateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: CreateCompanyPayload,
    ) => createCompany(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: companyQueryKeys.me(),
      });
    },
  });
}