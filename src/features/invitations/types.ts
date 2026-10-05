
export type InvitationStatus =
  | "INVITED"
  | "ACCEPTED"
  | "DECLINED"
  | "EXPIRED";

export interface CreateInvitationPayload {
  assessmentId: string;
  candidateId: string;
  expiresAt?: string;
}

export interface InvitationCandidate {
  id: string;
  name: string;
  email: string;
}

export interface InvitationAssessment {
  id: string;
  title: string;
  description?: string | null;
  duration: number;
  totalMarks: number;
  status: string;
}

export interface Invitation {
  id: string;
  assessmentId: string;
  candidateId: string;
  status: InvitationStatus;
  expiresAt?: string | null;
  createdAt: string;

  candidate?: InvitationCandidate;

  assessment?: InvitationAssessment;
}

/**
 * Candidate invitation.
 *
 * The candidate endpoint:
 *
 * GET /invitations/my
 *
 * returns invitations with assessment information.
 */
export interface CandidateInvitation {
  id: string;
  assessmentId: string;
  candidateId: string;
  status: InvitationStatus;
  expiresAt?: string | null;
  createdAt: string;

  assessment: InvitationAssessment;
}

/**
 * Attempt created after accepting an invitation.
 */
export interface CandidateAttempt {
  id: string;
  assessmentId: string;
  candidateId: string;
  status: string;
}

/**
 * POST /invitations
 */
export interface CreateInvitationResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Invitation;
}

/**
 * GET /invitations
 */
export interface GetInvitationsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Invitation[];
}

/**
 * GET /invitations/my
 */
export interface GetCandidateInvitationsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: CandidateInvitation[];
}

/**
 * PATCH /invitations/:id/accept
 */
export interface AcceptInvitationResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    invitation: CandidateInvitation;
    attempt: CandidateAttempt;
  };
}

/**
 * PATCH /invitations/:id/decline
 */
export interface DeclineInvitationResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: CandidateInvitation;
}

