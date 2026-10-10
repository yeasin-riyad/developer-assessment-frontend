import type { AuthUser, UserRole } from "@/features/auth";

export interface DashboardStats {
  title: string;
  value: number | string;
  description: string;
  href?: string;
}

export interface DashboardUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface DashboardSectionProps {
  user: AuthUser;
}

