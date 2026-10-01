import api from "@/lib/api";

import type {
  CurrentUserResponse,
} from "./types";

export async function getCurrentUser(): Promise<CurrentUserResponse> {
  return api<CurrentUserResponse>(
    "/users/me",
    {
      method: "GET",
    },
  );
}