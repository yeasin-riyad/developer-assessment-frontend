import api from "@/lib/api";

import type {
  CandidateQueryParams,
  GetCandidatesResponse,
} from "./types";

export async function getCandidates(
  params?: CandidateQueryParams,
): Promise<GetCandidatesResponse> {
  return api<GetCandidatesResponse>("/users/candidates", {
    method: "GET",
    query: params,
  });
}