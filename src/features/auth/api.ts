import api from "@/lib/api";

import type {
  RegisterPayload,
  RegisterResponse,
} from "./types";

export async function registerUser(
  payload: RegisterPayload,
): Promise<RegisterResponse> {
  return api<RegisterResponse>("/auth/register", {
    method: "POST",
    body: payload,
  });
}