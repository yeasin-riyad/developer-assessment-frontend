import api from "@/lib/api";

import type {
  CreateInvitationPayload,
  CreateInvitationResponse,
  GetInvitationsResponse,
} from "./types";

export async function createInvitation(
  payload: CreateInvitationPayload,
): Promise<CreateInvitationResponse> {
  return api<CreateInvitationResponse>("/invitations", {
    method: "POST",
    body: payload,
  });
}

export async function getMyInvitations(): Promise<GetInvitationsResponse> {
  return api<GetInvitationsResponse>("/invitations", {
    method: "GET",
  });
}