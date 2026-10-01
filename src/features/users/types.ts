import type { UserRole } from "@/features/auth";

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
}

export interface CurrentUserResponse {
  success: boolean;
  message: string;
  data: CurrentUser;
}