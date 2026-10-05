
import api from "@/lib/api";

import type {
  AcceptInvitationResponse,
  CreateInvitationPayload,
  CreateInvitationResponse,
  DeclineInvitationResponse,
  GetCandidateInvitationsResponse,
  GetInvitationsResponse,
} from "./types";

/**
 * Recruiter
 *
 * Create an invitation.
 */
export async function createInvitation(
  payload: CreateInvitationPayload,
): Promise<CreateInvitationResponse> {
  return api<CreateInvitationResponse>("/invitations", {
    method: "POST",
    body: payload,
  });
}

/**
 * Recruiter
 *
 * Get invitations sent by the recruiter.
 */
export async function getMyInvitations(): Promise<GetInvitationsResponse> {
  return api<GetInvitationsResponse>("/invitations", {
    method: "GET",
  });
}

/**
 * Candidate
 *
 * Get invitations received by the logged-in candidate.
 */
export async function getMyCandidateInvitations(): Promise<GetCandidateInvitationsResponse> {
  return api<GetCandidateInvitationsResponse>("/invitations/my", {
    method: "GET",
  });
}

/**
 * Candidate
 *
 * Accept an invitation.
 *
 * Backend will:
 * 1. Change invitation status to ACCEPTED
 * 2. Create an Attempt
 */
export async function acceptInvitation(
  invitationId: string,
): Promise<AcceptInvitationResponse> {
  return api<AcceptInvitationResponse>(
    `/invitations/${invitationId}/accept`,
    {
      method: "PATCH",
    },
  );
}

/**
 * Candidate
 *
 * Decline an invitation.
 */
export async function declineInvitation(
  invitationId: string,
): Promise<DeclineInvitationResponse> {
  return api<DeclineInvitationResponse>(
    `/invitations/${invitationId}/decline`,
    {
      method: "PATCH",
    },
  );
}

