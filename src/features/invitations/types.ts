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

export interface CreateInvitationResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Invitation;
}

export interface GetInvitationsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Invitation[];
}