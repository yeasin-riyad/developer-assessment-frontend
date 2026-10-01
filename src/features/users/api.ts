import api from "@/lib/api";

import type { CurrentUserResponse } from "./types";

export async function getCurrentUser(): Promise<CurrentUserResponse> {
  const accessToken = localStorage.getItem("accessToken");

  return api<CurrentUserResponse>("/users/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}