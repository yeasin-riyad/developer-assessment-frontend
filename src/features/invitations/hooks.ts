
"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  acceptInvitation,
  createInvitation,
  declineInvitation,
  getMyCandidateInvitations,
  getMyInvitations,
} from "./api";

import type {
  CreateInvitationPayload,
} from "./types";

/**
 * Query keys
 */
export const invitationQueryKeys = {
  all: ["invitations"] as const,

  lists: () =>
    [...invitationQueryKeys.all, "list"] as const,

  recruiterList: () =>
    [...invitationQueryKeys.lists(), "recruiter"] as const,

  candidateList: () =>
    [...invitationQueryKeys.lists(), "candidate"] as const,
};

/**
 * ============================================================
 * Recruiter
 * ============================================================
 */

/**
 * Get invitations sent by the recruiter.
 */
export function useMyInvitations() {
  return useQuery({
    queryKey: invitationQueryKeys.recruiterList(),
    queryFn: getMyInvitations,
  });
}

/**
 * Create invitation.
 */
export function useCreateInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: CreateInvitationPayload,
    ) => createInvitation(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: invitationQueryKeys.recruiterList(),
      });
    },
  });
}

/**
 * ============================================================
 * Candidate
 * ============================================================
 */

/**
 * Get invitations received by the candidate.
 */
export function useMyCandidateInvitations() {
  return useQuery({
    queryKey: invitationQueryKeys.candidateList(),
    queryFn: getMyCandidateInvitations,
  });
}

/**
 * Accept invitation.
 *
 * Backend creates the Attempt automatically.
 */
export function useAcceptInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invitationId: string) =>
      acceptInvitation(invitationId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: invitationQueryKeys.candidateList(),
      });
    },
  });
}

/**
 * Decline invitation.
 */
export function useDeclineInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (invitationId: string) =>
      declineInvitation(invitationId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: invitationQueryKeys.candidateList(),
      });
    },
  });
}

