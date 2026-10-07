import api from "@/lib/api";

import type { CandidateResult } from "./types";

interface ResultResponse {
  success: boolean;
  message: string;
  data: CandidateResult;
}

export async function getMyResult(
  attemptId: string,
): Promise<CandidateResult> {
  const response = await api<ResultResponse>(
    `/results/attempts/${attemptId}`,
    {
      method: "GET",
    },
  );

  return response.data;
}