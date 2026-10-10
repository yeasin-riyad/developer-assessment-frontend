
"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { adminApi } from "../api/admin.api";

import type {
  AdminProblemQuery,
  AdminRole,
  AssessmentStatus,
  CompanyStatus,
} from "../types/admin.types";

export const adminQueryKeys = {
  all: ["admin"] as const,

  statistics: () =>
    [...adminQueryKeys.all, "statistics"] as const,

  users: (filters?: object) =>
    [...adminQueryKeys.all, "users", filters] as const,

  user: (id: string) =>
    [...adminQueryKeys.all, "user", id] as const,

  companies: (filters?: object) =>
    [...adminQueryKeys.all, "companies", filters] as const,

  company: (id: string) =>
    [...adminQueryKeys.all, "company", id] as const,

  assessments: (filters?: object) =>
    [...adminQueryKeys.all, "assessments", filters] as const,

  assessment: (id: string) =>
    [...adminQueryKeys.all, "assessment", id] as const,

  // Problems
  problems: (filters?: AdminProblemQuery) =>
    [...adminQueryKeys.all, "problems", filters] as const,

  problem: (id: string) =>
    [...adminQueryKeys.all, "problem", id] as const,
};

// ============================================
// STATISTICS
// ============================================

export function useAdminStatistics() {
  return useQuery({
    queryKey: adminQueryKeys.statistics(),
    queryFn: adminApi.getStatistics,
  });
}

// ============================================
// USERS
// ============================================

export function useAdminUsers(filters: {
  search?: string;
  role?: AdminRole | "";
  isActive?: string;
}) {
  return useQuery({
    queryKey: adminQueryKeys.users(filters),
    queryFn: () => adminApi.getUsers(filters),
  });
}

export function useAdminUser(userId: string) {
  return useQuery({
    queryKey: adminQueryKeys.user(userId),
    queryFn: () => adminApi.getUser(userId),
    enabled: Boolean(userId),
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      role,
    }: {
      userId: string;
      role: AdminRole;
    }) => adminApi.updateUserRole(userId, role),

    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.all,
      }),
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      isActive,
    }: {
      userId: string;
      isActive: boolean;
    }) => adminApi.updateUserStatus(userId, isActive),

    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.all,
      }),
  });
}

export function useDeleteAdminUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) =>
      adminApi.deleteUser(userId),

    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.all,
      }),
  });
}

// ============================================
// COMPANIES
// ============================================

export function useAdminCompanies(filters: {
  search?: string;
  status?: CompanyStatus | "";
}) {
  return useQuery({
    queryKey: adminQueryKeys.companies(filters),
    queryFn: () => adminApi.getCompanies(filters),
  });
}

export function useUpdateCompanyStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      companyId,
      status,
    }: {
      companyId: string;
      status: CompanyStatus;
    }) => adminApi.updateCompanyStatus(companyId, status),

    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.all,
      }),
  });
}

export function useDeleteAdminCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (companyId: string) =>
      adminApi.deleteCompany(companyId),

    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.all,
      }),
  });
}

// ============================================
// ASSESSMENTS
// ============================================

export function useAdminAssessments(filters: {
  search?: string;
  status?: AssessmentStatus | "";
}) {
  return useQuery({
    queryKey: adminQueryKeys.assessments(filters),
    queryFn: () => adminApi.getAssessments(filters),
  });
}

export function useCloseAdminAssessment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (assessmentId: string) =>
      adminApi.closeAssessment(assessmentId),

    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.all,
      }),
  });
}

// ============================================
// PROBLEMS
// ============================================

export function useAdminProblems(
  filters: AdminProblemQuery = {},
) {
  return useQuery({
    queryKey: adminQueryKeys.problems(filters),
    queryFn: () => adminApi.getProblems(filters),
  });
}

export function useAdminProblem(problemId: string) {
  return useQuery({
    queryKey: adminQueryKeys.problem(problemId),
    queryFn: () => adminApi.getProblem(problemId),
    enabled: Boolean(problemId),
  });
}

export function useDeleteAdminProblem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (problemId: string) =>
      adminApi.deleteProblem(problemId),

    onSuccess: async (_data, problemId) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: adminQueryKeys.problems(),
        }),

        queryClient.invalidateQueries({
          queryKey: adminQueryKeys.problem(problemId),
        }),

        queryClient.invalidateQueries({
          queryKey: adminQueryKeys.statistics(),
        }),
      ]);
    },
  });
}