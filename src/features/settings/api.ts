
import api from "@/lib/api";

import type {
  ChangePasswordPayload,
  ChangePasswordResponse,
  SettingsResponse,
  SettingsUser,
  UpdateProfilePayload,
  UpdateProfileResponse,
} from "./types";

export async function getMySettings(): Promise<SettingsUser> {
  const response = await api<SettingsResponse>("/settings", {
    method: "GET",
  });

  return response.data;
}

export async function updateMyProfile(
  payload: UpdateProfilePayload,
): Promise<SettingsUser> {
  const response = await api<UpdateProfileResponse>(
    "/settings/profile",
    {
      method: "PATCH",
      body: payload,
    },
  );

  return response.data;
}

export async function changeMyPassword(
  payload: ChangePasswordPayload,
): Promise<ChangePasswordResponse> {
  return api<ChangePasswordResponse>("/settings/password", {
    method: "PATCH",
    body: payload,
  });
}