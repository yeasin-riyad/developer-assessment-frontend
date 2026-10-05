import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getAttemptQuestions,
  getAttemptStatus,
  getMyAttempt,
  saveAnswer,
  startAttempt,
  submitAttempt,
} from "./api";

import type { SaveAnswerPayload } from "./types";

export const attemptQueryKeys = {
  all: ["attempts"] as const,

  detail: (attemptId: string) =>
    ["attempts", attemptId] as const,

  questions: (attemptId: string) =>
    ["attempts", attemptId, "questions"] as const,

  status: (attemptId: string) =>
    ["attempts", attemptId, "status"] as const,
};

export function useAttempt(attemptId: string) {
  return useQuery({
    queryKey: attemptQueryKeys.detail(attemptId),
    queryFn: () => getMyAttempt(attemptId),
    enabled: Boolean(attemptId),
  });
}

export function useAttemptQuestions(
  attemptId: string,
  enabled = true,
) {
  return useQuery({
    queryKey: attemptQueryKeys.questions(attemptId),
    queryFn: () => getAttemptQuestions(attemptId),
    enabled: Boolean(attemptId) && enabled,
    staleTime: Infinity,
  });
}

export function useAttemptStatus(
  attemptId: string,
  enabled = true,
) {
  return useQuery({
    queryKey: attemptQueryKeys.status(attemptId),
    queryFn: () => getAttemptStatus(attemptId),
    enabled: Boolean(attemptId) && enabled,
    refetchInterval: 30_000,
  });
}

export function useStartAttempt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (attemptId: string) =>
      startAttempt(attemptId),

    onSuccess: (attempt) => {
      queryClient.setQueryData(
        attemptQueryKeys.detail(attempt.id),
        attempt,
      );

      queryClient.invalidateQueries({
        queryKey: attemptQueryKeys.questions(
          attempt.id,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: attemptQueryKeys.status(
          attempt.id,
        ),
      });
    },
  });
}

export function useSaveAnswer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      attemptId,
      payload,
    }: {
      attemptId: string;
      payload: SaveAnswerPayload;
    }) => saveAnswer(attemptId, payload),

    onSuccess: (answer) => {
      queryClient.setQueryData(
        attemptQueryKeys.detail(answer.attemptId),
        (previous) => {
          if (!previous) {
            return previous;
          }

          const existingAnswers =
            previous.answers ?? [];

          const alreadyExists = existingAnswers.some(
            (item) =>
              item.problemId === answer.problemId,
          );

          return {
            ...previous,

            answers: alreadyExists
              ? existingAnswers.map((item) =>
                  item.problemId === answer.problemId
                    ? answer
                    : item,
                )
              : [...existingAnswers, answer],
          };
        },
      );
    },
  });
}

export function useSubmitAttempt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (attemptId: string) =>
      submitAttempt(attemptId),

    onSuccess: (attempt) => {
      queryClient.setQueryData(
        attemptQueryKeys.detail(attempt.id),
        attempt,
      );

      queryClient.invalidateQueries({
        queryKey: attemptQueryKeys.status(
          attempt.id,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: attemptQueryKeys.questions(
          attempt.id,
        ),
      });
    },
  });
}