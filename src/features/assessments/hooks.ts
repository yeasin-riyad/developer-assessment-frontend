import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  addProblemToAssessment,
  createAssessment,
  getAssessmentById,
  getAssessments,
  publishAssessment,
  removeProblemFromAssessment,
  unpublishAssessment,
  updateAssessment,
} from "./api";

import type {
  AddProblemPayload,
  CreateAssessmentPayload,
  UpdateAssessmentPayload,
} from "./types";

export const assessmentQueryKeys = {
  all: ["assessments"] as const,

  lists: () => [
    ...assessmentQueryKeys.all,
    "list",
  ] as const,

  list: () => [
    ...assessmentQueryKeys.lists(),
  ] as const,

  details: () => [
    ...assessmentQueryKeys.all,
    "detail",
  ] as const,

  detail: (assessmentId: string) => [
    ...assessmentQueryKeys.details(),
    assessmentId,
  ] as const,
};

export function useAssessments() {
  return useQuery({
    queryKey: assessmentQueryKeys.list(),
    queryFn: getAssessments,
  });
}

export function useAssessment(assessmentId: string) {
  return useQuery({
    queryKey: assessmentQueryKeys.detail(assessmentId),
    queryFn: () => getAssessmentById(assessmentId),
    enabled: Boolean(assessmentId),
  });
}

export function useCreateAssessment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAssessmentPayload) =>
      createAssessment(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: assessmentQueryKeys.lists(),
      });
    },
  });
}

export function useUpdateAssessment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      assessmentId,
      payload,
    }: {
      assessmentId: string;
      payload: UpdateAssessmentPayload;
    }) => updateAssessment(assessmentId, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: assessmentQueryKeys.detail(
          variables.assessmentId,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: assessmentQueryKeys.lists(),
      });
    },
  });
}

export function useAddProblemToAssessment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      assessmentId,
      payload,
    }: {
      assessmentId: string;
      payload: AddProblemPayload;
    }) =>
      addProblemToAssessment(
        assessmentId,
        payload,
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: assessmentQueryKeys.detail(
          variables.assessmentId,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: assessmentQueryKeys.lists(),
      });
    },
  });
}

export function useRemoveProblemFromAssessment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      assessmentId,
      problemId,
    }: {
      assessmentId: string;
      problemId: string;
    }) =>
      removeProblemFromAssessment(
        assessmentId,
        problemId,
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: assessmentQueryKeys.detail(
          variables.assessmentId,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: assessmentQueryKeys.lists(),
      });
    },
  });
}

export function usePublishAssessment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (assessmentId: string) =>
      publishAssessment(assessmentId),

    onSuccess: (_, assessmentId) => {
      queryClient.invalidateQueries({
        queryKey: assessmentQueryKeys.detail(
          assessmentId,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: assessmentQueryKeys.lists(),
      });
    },
  });
}

export function useUnpublishAssessment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (assessmentId: string) =>
      unpublishAssessment(assessmentId),

    onSuccess: (_, assessmentId) => {
      queryClient.invalidateQueries({
        queryKey: assessmentQueryKeys.detail(
          assessmentId,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: assessmentQueryKeys.lists(),
      });
    },
  });
}