
export type UserRole =
  | "ADMIN"
  | "RECRUITER"
  | "CREATOR"
  | "EVALUATOR"
  | "CANDIDATE";

export type AuthProvider = "LOCAL" | "GOOGLE";

export interface SettingsUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  authProvider: AuthProvider;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SettingsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: SettingsUser;
}

export interface UpdateProfilePayload {
  name: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: SettingsUser;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: null;
}