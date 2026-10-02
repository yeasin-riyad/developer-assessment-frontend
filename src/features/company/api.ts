import api from "@/lib/api";

import type {
  CreateCompanyPayload,
  CreateCompanyResponse,
  GetMyCompanyResponse,
} from "./types";

export async function createCompany(
  payload: CreateCompanyPayload,
) {
  return api<CreateCompanyResponse>("/companies", {
    method: "POST",
    body: payload,
  });
}

export async function getMyCompany() {
  return api<GetMyCompanyResponse>("/companies/me", {
    method: "GET",
  });
}