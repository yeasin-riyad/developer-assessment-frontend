
import request from "@/lib/api";
import type {
  AdminAssessment,
  AdminCompany,
  AdminRole,
  AdminStatistics,
  AdminUser,
  ApiResponse,
  AssessmentStatus,
  CompanyStatus,
   AdminProblem,
  AdminProblemQuery,
} from "../types/admin.types";

const ADMIN_URL = "/admin";

export const adminApi = {
  getStatistics: () =>
    request<ApiResponse<AdminStatistics>>(
      `${ADMIN_URL}/statistics`,
    ),

  getUsers: (params?: {
    search?: string;
    role?: AdminRole | "";
    isActive?: string;
  }) =>
    request<ApiResponse<AdminUser[]>>(
      `${ADMIN_URL}/users`,
      {
        query: {
          ...(params?.search && {
            search: params.search,
          }),
          ...(params?.role && {
            role: params.role,
          }),
          ...(params?.isActive && {
            isActive: params.isActive,
          }),
        },
      },
    ),

  getUser: (userId: string) =>
    request<ApiResponse<AdminUser>>(
      `${ADMIN_URL}/users/${userId}`,
    ),

  updateUserRole: (
    userId: string,
    role: AdminRole,
  ) =>
    request<ApiResponse<AdminUser>>(
      `${ADMIN_URL}/users/${userId}/role`,
      {
        method: "PATCH",
        body: { role },
      },
    ),

  updateUserStatus: (
    userId: string,
    isActive: boolean,
  ) =>
    request<ApiResponse<AdminUser>>(
      `${ADMIN_URL}/users/${userId}/status`,
      {
        method: "PATCH",
        body: { isActive },
      },
    ),

  deleteUser: (userId: string) =>
    request<ApiResponse<unknown>>(
      `${ADMIN_URL}/users/${userId}`,
      { method: "DELETE" },
    ),

  getCompanies: (params?: {
    search?: string;
    status?: CompanyStatus | "";
  }) =>
    request<ApiResponse<AdminCompany[]>>(
      `${ADMIN_URL}/companies`,
      {
        query: {
          ...(params?.search && {
            search: params.search,
          }),
          ...(params?.status && {
            status: params.status,
          }),
        },
      },
    ),

  getCompany: (companyId: string) =>
    request<ApiResponse<AdminCompany>>(
      `${ADMIN_URL}/companies/${companyId}`,
    ),

  updateCompanyStatus: (
    companyId: string,
    status: CompanyStatus,
  ) =>
    request<ApiResponse<AdminCompany>>(
      `${ADMIN_URL}/companies/${companyId}/status`,
      {
        method: "PATCH",
        body: { status },
      },
    ),

  deleteCompany: (companyId: string) =>
    request<ApiResponse<unknown>>(
      `${ADMIN_URL}/companies/${companyId}`,
      { method: "DELETE" },
    ),

  getAssessments: (params?: {
    search?: string;
    status?: AssessmentStatus | "";
  }) =>
    request<ApiResponse<AdminAssessment[]>>(
      `${ADMIN_URL}/assessments`,
      {
        query: {
          ...(params?.search && {
            search: params.search,
          }),
          ...(params?.status && {
            status: params.status,
          }),
        },
      },
    ),

  getAssessment: (assessmentId: string) =>
    request<ApiResponse<AdminAssessment>>(
      `${ADMIN_URL}/assessments/${assessmentId}`,
    ),

  closeAssessment: (assessmentId: string) =>
    request<ApiResponse<AdminAssessment>>(
      `${ADMIN_URL}/assessments/${assessmentId}/close`,
      { method: "PATCH" },
    ),

      // Problems
  getProblems: (params?: AdminProblemQuery) =>
    request<ApiResponse<AdminProblem[]>>(
      `${ADMIN_URL}/problems`,
      {
        query: {
          ...(params?.type && {
            type: params.type,
          }),

          ...(params?.difficulty && {
            difficulty: params.difficulty,
          }),

          ...(params?.search?.trim() && {
            search: params.search.trim(),
          }),
        },
      },
    ),

  getProblem: (problemId: string) =>
    request<ApiResponse<AdminProblem>>(
      `${ADMIN_URL}/problems/${problemId}`,
    ),

  deleteProblem: (problemId: string) =>
    request<ApiResponse<null>>(
      `${ADMIN_URL}/problems/${problemId}`,
      {
        method: "DELETE",
      },
    ),
};