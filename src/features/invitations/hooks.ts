"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createInvitation,
  getMyInvitations,
} from "./api";

import type {
  CreateInvitationPayload,
} from "./types";

export const invitationQueryKeys = {
  all: ["invitations"] as const,

  lists: () => [
    ...invitationQueryKeys.all,
    "list",
  ] as const,

  list: () => [
    ...invitationQueryKeys.lists(),
  ] as const,
};

export function useMyInvitations() {
  return useQuery({
    queryKey: invitationQueryKeys.list(),
    queryFn: getMyInvitations,
  });
}

export function useCreateInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: CreateInvitationPayload,
    ) => createInvitation(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: invitationQueryKeys.lists(),
      });
    },
  });
}