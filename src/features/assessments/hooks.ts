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
  getMyCandidateAssessments,
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

/**
 * Assessment query keys
 */
export const assessmentQueryKeys = {
  all: ["assessments"] as const,

  lists: () =>
    [...assessmentQueryKeys.all, "list"] as const,

  list: () =>
    [...assessmentQueryKeys.lists()] as const,

  details: () =>
    [...assessmentQueryKeys.all, "detail"] as const,

  detail: (assessmentId: string) =>
    [
      ...assessmentQueryKeys.details(),
      assessmentId,
    ] as const,

  candidate: () =>
    [...assessmentQueryKeys.all, "candidate"] as const,
};

/**
 * Get all assessments.
 *
 * Recruiter / Creator / Evaluator
 */
export function useAssessments() {
  return useQuery({
    queryKey: assessmentQueryKeys.list(),
    queryFn: getAssessments,
  });
}

/**
 * Get a single assessment.
 */
export function useAssessment(
  assessmentId: string,
) {
  return useQuery({
    queryKey:
      assessmentQueryKeys.detail(assessmentId),

    queryFn: () =>
      getAssessmentById(assessmentId),

    enabled: Boolean(assessmentId),
  });
}

/**
 * Get assessments assigned to the
 * currently logged-in candidate.
 */
export function useMyCandidateAssessments() {
  return useQuery({
    queryKey:
      assessmentQueryKeys.candidate(),

    queryFn: getMyCandidateAssessments,

    enabled: true,
  });
}

/**
 * Create assessment.
 */
export function useCreateAssessment() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      payload: CreateAssessmentPayload,
    ) => createAssessment(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          assessmentQueryKeys.lists(),
      });
    },
  });
}

/**
 * Update assessment.
 */
export function useUpdateAssessment() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      assessmentId,
      payload,
    }: {
      assessmentId: string;
      payload: UpdateAssessmentPayload;
    }) =>
      updateAssessment(
        assessmentId,
        payload,
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey:
          assessmentQueryKeys.detail(
            variables.assessmentId,
          ),
      });

      queryClient.invalidateQueries({
        queryKey:
          assessmentQueryKeys.lists(),
      });
    },
  });
}

/**
 * Add problem to assessment.
 */
export function useAddProblemToAssessment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      assessmentId,
      payload,
    }: {
      assessmentId: string;
      payload: AddProblemPayload;
    }) => {
      console.log("🚀 MUTATION FUNCTION CALLED");

      return addProblemToAssessment(
        assessmentId,
        payload,
      );
    },

    onSuccess: (data, variables) => {
      console.log("✅ HOOK SUCCESS", data);

      queryClient.invalidateQueries({
        queryKey: assessmentQueryKeys.detail(
          variables.assessmentId,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: assessmentQueryKeys.lists(),
      });
    },

    onError: (error) => {
      console.error("❌ HOOK ERROR", error);
    },

    onSettled: (data, error) => {
      console.log("🏁 HOOK SETTLED", {
        data,
        error,
      });
    },
  });
}

/**
 * Remove problem from assessment.
 */
export function useRemoveProblemFromAssessment() {
  const queryClient =
    useQueryClient();

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
        queryKey:
          assessmentQueryKeys.detail(
            variables.assessmentId,
          ),
      });

      queryClient.invalidateQueries({
        queryKey:
          assessmentQueryKeys.lists(),
      });
    },
  });
}

/**
 * Publish assessment.
 */
export function usePublishAssessment() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      assessmentId: string,
    ) => publishAssessment(assessmentId),

    onSuccess: (_, assessmentId) => {
      queryClient.invalidateQueries({
        queryKey:
          assessmentQueryKeys.detail(
            assessmentId,
          ),
      });

      queryClient.invalidateQueries({
        queryKey:
          assessmentQueryKeys.lists(),
      });
    },
  });
}

/**
 * Unpublish assessment.
 */
export function useUnpublishAssessment() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      assessmentId: string,
    ) =>
      unpublishAssessment(assessmentId),

    onSuccess: (_, assessmentId) => {
      queryClient.invalidateQueries({
        queryKey:
          assessmentQueryKeys.detail(
            assessmentId,
          ),
      });

      queryClient.invalidateQueries({
        queryKey:
          assessmentQueryKeys.lists(),
      });
    },
  });
}