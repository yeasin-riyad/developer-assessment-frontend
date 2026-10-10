
"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  changeMyPassword,
  getMySettings,
  updateMyProfile,
} from "./api";

import type {
  ChangePasswordPayload,
  UpdateProfilePayload,
} from "./types";

export const settingsQueryKeys = {
  all: ["settings"] as const,
  me: () => [...settingsQueryKeys.all, "me"] as const,
};

export function useMySettings() {
  return useQuery({
    queryKey: settingsQueryKeys.me(),
    queryFn: getMySettings,
  });
}

export function useUpdateMyProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) =>
      updateMyProfile(payload),

    onSuccess: (updatedUser) => {
      queryClient.setQueryData(
        settingsQueryKeys.me(),
        updatedUser,
      );

      queryClient.invalidateQueries({
        queryKey: ["auth", "me"],
      });
    },
  });
}

export function useChangeMyPassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) =>
      changeMyPassword(payload),
  });
}