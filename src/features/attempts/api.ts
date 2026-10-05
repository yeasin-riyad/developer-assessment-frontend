import api from "@/lib/api";

import type {
  Attempt,
  AttemptAnswer,
  AttemptStatus,
  GetAttemptQuestionsResponse,
  SaveAnswerPayload,
  SubmitAttemptResponse,
} from "./types";

interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

/**
 * Candidate
 *
 * Get my attempt details.
 */
export async function getMyAttempt(
  attemptId: string,
): Promise<Attempt> {
  const response = await api<ApiResponse<Attempt>>(
    `/attempts/${attemptId}`,
    {
      method: "GET",
    },
  );

  return response.data;
}

/**
 * Candidate
 *
 * Start an assessment attempt.
 */
export async function startAttempt(
  attemptId: string,
): Promise<Attempt> {
  const response = await api<ApiResponse<Attempt>>(
    `/attempts/${attemptId}/start`,
    {
      method: "POST",
    },
  );

  return response.data;
}

/**
 * Candidate
 *
 * Get questions for the attempt.
 */
export async function getAttemptQuestions(
  attemptId: string,
): Promise<GetAttemptQuestionsResponse> {
  const response =
    await api<ApiResponse<GetAttemptQuestionsResponse>>(
      `/attempts/${attemptId}/questions`,
      {
        method: "GET",
      },
    );

  return response.data;
}

/**
 * Candidate
 *
 * Get the current attempt status.
 */
export async function getAttemptStatus(
  attemptId: string,
): Promise<AttemptStatus> {
  const response =
    await api<ApiResponse<AttemptStatus>>(
      `/attempts/${attemptId}/status`,
      {
        method: "GET",
      },
    );

  return response.data;
}

/**
 * Candidate
 *
 * Save or update an answer.
 */
export async function saveAnswer(
  attemptId: string,
  payload: SaveAnswerPayload,
): Promise<AttemptAnswer> {
  const response =
    await api<ApiResponse<AttemptAnswer>>(
      `/attempts/${attemptId}/answers`,
      {
        method: "PATCH",
        body: payload,
      },
    );

  return response.data;
}

/**
 * Candidate
 *
 * Submit the assessment.
 */
export async function submitAttempt(
  attemptId: string,
): Promise<SubmitAttemptResponse> {
  const response =
    await api<ApiResponse<SubmitAttemptResponse>>(
      `/attempts/${attemptId}/submit`,
      {
        method: "POST",
      },
    );

  return response.data;
}