import api from "@/lib/api";

import type {
  CreateProblemPayload,
  CreateProblemResponse,
  GetProblemResponse,
  GetProblemsResponse,
} from "./types";

export async function createProblem(
  payload: CreateProblemPayload,
): Promise<CreateProblemResponse> {
  return api<CreateProblemResponse>("/problems", {
    method: "POST",
    body: payload,
  });
}

export async function getProblems(): Promise<GetProblemsResponse> {
  return api<GetProblemsResponse>("/problems", {
    method: "GET",
  });
}

export async function getProblemById(
  problemId: string,
): Promise<GetProblemResponse> {
  return api<GetProblemResponse>(
    `/problems/${problemId}`,
    {
      method: "GET",
    },
  );
}