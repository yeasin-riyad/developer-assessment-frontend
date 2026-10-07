import  api  from "@/lib/api";

import type {
  CandidateActivityQuery,
  CandidateActivityResponse,
  CandidateAssessmentQuery,
  CandidateAssessmentResponse,
  CandidateDetails,
  CandidateQueryParams,
  GetCandidatesResponse,
} from "./types";

export async function getCandidates(
  params?: CandidateQueryParams,
): Promise<GetCandidatesResponse> {
  return api<GetCandidatesResponse>(
    "/candidates",
    {
      method: "GET",
      query: {
        page: params?.page ?? 1,
        limit: params?.limit ?? 10,
        ...(params?.search
          ? {
              search: params.search,
            }
          : {}),
      },
    },
  );
}

export async function getCandidateById(
  candidateId: string,
): Promise<CandidateDetails> {
  return api<CandidateDetails>(
    `/candidates/${candidateId}`,
    {
      method: "GET",
    },
  );
}

export async function getCandidateActivities(
  candidateId: string,
  query: CandidateActivityQuery = {},
): Promise<CandidateActivityResponse> {
  return api<CandidateActivityResponse>(
    `/candidates/${candidateId}/activities`,
    {
      method: "GET",
      query: {
        page: query.page ?? 1,
        limit: query.limit ?? 10,
      },
    },
  );
}

export async function getCandidateAssessments(
  candidateId: string,
  query: CandidateAssessmentQuery = {},
): Promise<CandidateAssessmentResponse> {
  return api<CandidateAssessmentResponse>(
    `/candidates/${candidateId}/assessments`,
    {
      method: "GET",
      query: {
        page: query.page ?? 1,
        limit: query.limit ?? 10,
      },
    },
  );
}