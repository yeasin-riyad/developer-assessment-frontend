import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createProblem,
  getProblemById,
  getProblems,
} from "./api";

import type {
  CreateProblemPayload,
  ProblemQueryParams,
} from "./types";

export const problemQueryKeys = {
  all: ["problems"] as const,

  lists: () =>
    [...problemQueryKeys.all, "list"] as const,

  list: (params?: ProblemQueryParams) =>
    [
      ...problemQueryKeys.lists(),
      params,
    ] as const,

  details: () =>
    [...problemQueryKeys.all, "detail"] as const,

  detail: (problemId: string) =>
    [
      ...problemQueryKeys.details(),
      problemId,
    ] as const,
};

export function useProblems(
  params?: ProblemQueryParams,
) {
  return useQuery({
    queryKey: problemQueryKeys.list(params),
    queryFn: () => getProblems(params),
  });
}

export function useProblem(
  problemId: string,
) {
  return useQuery({
    queryKey:
      problemQueryKeys.detail(problemId),

    queryFn: () =>
      getProblemById(problemId),

    enabled: Boolean(problemId),
  });
}

export function useCreateProblem() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      payload: CreateProblemPayload,
    ) => createProblem(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          problemQueryKeys.lists(),
      });
    },
  });
}