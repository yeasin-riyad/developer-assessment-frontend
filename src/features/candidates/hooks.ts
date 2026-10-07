"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getCandidateActivities,
  getCandidateAssessments,
  getCandidateById,
  getCandidates,
} from "./api";

import type {
  CandidateActivityQuery,
  CandidateAssessmentQuery,
  CandidateQueryParams,
} from "./types";

export const candidateQueryKeys = {
  all: ["candidates"] as const,

  lists: () =>
    [...candidateQueryKeys.all, "list"] as const,

  list: (params?: CandidateQueryParams) =>
    [...candidateQueryKeys.lists(), params] as const,

  details: () =>
    [...candidateQueryKeys.all, "detail"] as const,

  detail: (candidateId: string) =>
    [...candidateQueryKeys.details(), candidateId] as const,

  activities: (candidateId: string) =>
    [...candidateQueryKeys.all, "activities", candidateId] as const,

  activity: (
    candidateId: string,
    query: CandidateActivityQuery,
  ) =>
    [...candidateQueryKeys.activities(candidateId), query] as const,

  assessments: (candidateId: string) =>
    [...candidateQueryKeys.all, "assessments", candidateId] as const,

  assessment: (
    candidateId: string,
    query: CandidateAssessmentQuery,
  ) =>
    [...candidateQueryKeys.assessments(candidateId), query] as const,
};

/**
 * Existing hook.
 * Keep this because InviteCandidateDialog already uses it.
 */
export function useCandidates(params?: CandidateQueryParams) {
  return useQuery({
    queryKey: candidateQueryKeys.list(params),
    queryFn: () => getCandidates(params),
  });
}

export function useCandidate(candidateId: string) {
  return useQuery({
    queryKey: candidateQueryKeys.detail(candidateId),
    queryFn: () => getCandidateById(candidateId),
    enabled: Boolean(candidateId),
  });
}

export function useCandidateActivities(
  candidateId: string,
  query: CandidateActivityQuery = {},
) {
  return useQuery({
    queryKey: candidateQueryKeys.activity(candidateId, query),
    queryFn: () => getCandidateActivities(candidateId, query),
    enabled: Boolean(candidateId),
    placeholderData: (previousData) => previousData,
  });
}

export function useCandidateAssessments(
  candidateId: string,
  query: CandidateAssessmentQuery = {},
) {
  return useQuery({
    queryKey: candidateQueryKeys.assessment(candidateId, query),
    queryFn: () => getCandidateAssessments(candidateId, query),
    enabled: Boolean(candidateId),
    placeholderData: (previousData) => previousData,
  });
}