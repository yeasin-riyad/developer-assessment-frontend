export enum UserRole {
  CANDIDATE = "CANDIDATE",
  CREATOR = "CREATOR",
}

export interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: AuthUser;
}