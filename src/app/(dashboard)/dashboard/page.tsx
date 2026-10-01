"use client";

import {
  UserRole,
} from "@/features/auth";

import {
  AdminDashboard,
  CandidateDashboard,
  CreatorDashboard,
  EvaluatorDashboard,
  RecruiterDashboard,
} from "@/features/dashboard";

import { useAuth } from "@/providers/auth.provider";

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  switch (user.role) {
    case UserRole.RECRUITER:
      return (
        <RecruiterDashboard user={user} />
      );

    case UserRole.CREATOR:
      return (
        <CreatorDashboard user={user} />
      );

    case UserRole.EVALUATOR:
      return (
        <EvaluatorDashboard user={user} />
      );

    case UserRole.CANDIDATE:
      return (
        <CandidateDashboard user={user} />
      );

    case UserRole.ADMIN:
      return (
        <AdminDashboard user={user} />
      );

    default:
      return null;
  }
}