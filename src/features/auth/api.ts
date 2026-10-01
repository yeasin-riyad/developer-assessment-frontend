import api from "@/lib/api";

import type {
  LoginPayload,
  LoginResponse,
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

export async function loginUser(
  payload: LoginPayload,
): Promise<LoginResponse> {
  return api<LoginResponse>("/auth/login", {
    method: "POST",
    body: payload,
  });
}