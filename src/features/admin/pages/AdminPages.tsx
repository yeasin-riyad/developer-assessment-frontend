"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  useAdminStatistics,
  useAdminUsers,
  useAdminCompanies,
  useAdminAssessments,
  useUpdateUserRole,
  useUpdateUserStatus,
  useDeleteAdminUser,
  useUpdateCompanyStatus,
  useDeleteAdminCompany,
  useCloseAdminAssessment,
} from "../hooks/useAdmin";

import type {
  AdminRole,
  AdminUser,
  AdminCompany,
  AdminAssessment,
  CompanyStatus,
  AssessmentStatus,
} from "../types/admin.types";

const roles: AdminRole[] = [
  "CANDIDATE",
  "RECRUITER",
  "CREATOR",
  "EVALUATOR",
  "ADMIN",
];

function getList<T>(
  response: { data: unknown } | undefined,
  key: string,
): T[] {
  if (!response) return [];

  const data = response.data;

  if (Array.isArray(data)) return data as T[];

  if (
    data &&
    typeof data === "object" &&
    key in data
  ) {
    const list = (data as Record<string, unknown>)[key];
    return Array.isArray(list) ? (list as T[]) : [];
  }

  return [];
}

function PageHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-7">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">
        {title}
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        {description}
      </p>
    </div>
  );
}

function StatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: number | undefined;
  detail?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">
        {label}
      </p>
      <p className="mt-3 text-3xl font-bold text-slate-900">
        {value ?? "—"}
      </p>
      {detail && (
        <p className="mt-2 text-xs text-slate-500">
          {detail}
        </p>
      )}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
      Loading data...
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700"
    >
      {message}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="p-10 text-center text-sm text-slate-500">
      {message}
    </div>
  );
}

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        active
          ? "bg-emerald-50 text-emerald-700"
          : "bg-slate-100 text-slate-600"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function Badge({ value }: { value: string }) {
  const color =
    value === "ACTIVE" || value === "PUBLISHED"
      ? "bg-emerald-50 text-emerald-700"
      : value === "SUSPENDED" ||
          value === "CLOSED"
        ? "bg-red-50 text-red-700"
        : value === "DRAFT"
          ? "bg-amber-50 text-amber-700"
          : "bg-indigo-50 text-indigo-700";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${color}`}
    >
      {value.replaceAll("_", " ")}
    </span>
  );
}

function TableShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[760px] text-left text-sm">
        {children}
      </table>
    </div>
  );
}

const thClass =
  "bg-slate-50 px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500";

const tdClass =
  "border-t border-slate-100 px-5 py-4 align-middle text-slate-700";

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

const buttonClass =
  "rounded-lg px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/* -------------------------------------------------------------------------- */
/* Confirm Dialog                                                             */
/* -------------------------------------------------------------------------- */

type ConfirmState = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  destructive?: boolean;
  onConfirm: () => void | Promise<void>;
};

function useConfirmDialog() {
  const [state, setState] = useState<ConfirmState>({
    open: false,
    title: "",
    description: "",
    onConfirm: () => {},
  });

  function confirm(options: Omit<ConfirmState, "open">) {
    setState({ ...options, open: true });
  }

  function close() {
    setState((prev) => ({ ...prev, open: false }));
  }

  async function handleConfirm() {
    try {
      await state.onConfirm();
    } finally {
      close();
    }
  }

  const dialog = (
    <AlertDialog open={state.open} onOpenChange={(open) => !open && close()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{state.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {state.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={
              state.destructive
                ? "bg-red-600 text-white hover:bg-red-700"
                : undefined
            }
          >
            {state.confirmLabel ?? "Confirm"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return { confirm, dialog };
}

/* -------------------------------------------------------------------------- */
/* Users                                                                      */
/* -------------------------------------------------------------------------- */

export function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<AdminRole | "">("");
  const [isActive, setIsActive] = useState("");

  const filters = { search, role, isActive };

  const { data, isLoading, isError, error } =
    useAdminUsers(filters);

  const updateRole = useUpdateUserRole();
  const updateStatus = useUpdateUserStatus();
  const deleteUser = useDeleteAdminUser();

  const { confirm, dialog } = useConfirmDialog();

  const users = getList<AdminUser>(data, "users");

  async function changeRole(
    userId: string,
    nextRole: AdminRole,
  ) {
    try {
      await updateRole.mutateAsync({
        userId,
        role: nextRole,
      });
      toast.success("User role updated successfully.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not update the user's role.",
      );
    }
  }

  function toggleStatus(user: AdminUser) {
    const nextStatus = !user.isActive;

    confirm({
      title: nextStatus ? "Activate user" : "Deactivate user",
      description: `Are you sure you want to ${
        nextStatus ? "activate" : "deactivate"
      } ${user.name}?`,
      confirmLabel: nextStatus ? "Activate" : "Deactivate",
      destructive: !nextStatus,
      onConfirm: async () => {
        try {
          await updateStatus.mutateAsync({
            userId: user.id,
            isActive: nextStatus,
          });
          toast.success(
            `User ${nextStatus ? "activated" : "deactivated"} successfully.`,
          );
        } catch (error) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Could not update the user's status.",
          );
        }
      },
    });
  }

  function removeUser(user: AdminUser) {
    confirm({
      title: "Delete user",
      description: `Delete ${user.name} (${user.email})? This action may be irreversible.`,
      confirmLabel: "Delete",
      destructive: true,
      onConfirm: async () => {
        try {
          await deleteUser.mutateAsync(user.id);
          toast.success("User deleted successfully.");
        } catch (error) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Could not delete this user.",
          );
        }
      },
    });
  }

  return (
    <div className="space-y-6">
      {dialog}

      <PageHeader
        title="Manage Users"
        description="Search user accounts, manage roles, and control account access."
      />

      <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-3">
        <input
          className={inputClass}
          placeholder="Search name or email..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          className={inputClass}
          value={role}
          onChange={(event) =>
            setRole(event.target.value as AdminRole | "")
          }
        >
          <option value="">All roles</option>
          {roles.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          className={inputClass}
          value={isActive}
          onChange={(event) => setIsActive(event.target.value)}
        >
          <option value="">All account statuses</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState
          message={
            error instanceof Error
              ? error.message
              : "Unable to load users."
          }
        />
      ) : (
        <TableShell>
          <thead>
            <tr>
              <th className={thClass}>User</th>
              <th className={thClass}>Role</th>
              <th className={thClass}>Company</th>
              <th className={thClass}>Status</th>
              <th className={thClass}>Joined</th>
              <th className={thClass}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/70">
                <td className={tdClass}>
                  <p className="font-semibold text-slate-900">
                    {user.name}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {user.email}
                  </p>
                </td>

                <td className={tdClass}>
                  <select
                    className="max-w-36 rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs"
                    value={user.role}
                    disabled={
                      updateRole.isPending ||
                      deleteUser.isPending
                    }
                    onChange={(event) =>
                      changeRole(
                        user.id,
                        event.target.value as AdminRole,
                      )
                    }
                  >
                    {roles.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </td>

                <td className={tdClass}>
                  {user.company?.name ?? "—"}
                </td>

                <td className={tdClass}>
                  <StatusBadge active={user.isActive} />
                </td>

                <td className={tdClass}>
                  {formatDate(user.createdAt)}
                </td>

                <td className={tdClass}>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className={`${buttonClass} border border-slate-200 text-slate-700 hover:bg-slate-100`}
                      disabled={
                        updateStatus.isPending ||
                        deleteUser.isPending
                      }
                      onClick={() => toggleStatus(user)}
                    >
                      {user.isActive ? "Deactivate" : "Activate"}
                    </button>

                    <button
                      type="button"
                      className={`${buttonClass} bg-red-50 text-red-700 hover:bg-red-100`}
                      disabled={
                        updateStatus.isPending ||
                        deleteUser.isPending
                      }
                      onClick={() => removeUser(user)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan={6}>
                  <EmptyState message="No users match your filters." />
                </td>
              </tr>
            )}
          </tbody>
        </TableShell>
      )}

      <p className="text-sm text-slate-500">
        {users.length} user{users.length === 1 ? "" : "s"} found
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Companies                                                                  */
/* -------------------------------------------------------------------------- */

export function AdminCompaniesPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<CompanyStatus | "">("");

  const { data, isLoading, isError, error } =
    useAdminCompanies({ search, status });

  const updateStatus = useUpdateCompanyStatus();
  const deleteCompany = useDeleteAdminCompany();

  const { confirm, dialog } = useConfirmDialog();

  const companies = getList<AdminCompany>(
    data,
    "companies",
  );

  function toggleCompany(company: AdminCompany) {
    const nextStatus: CompanyStatus =
      company.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";

    confirm({
      title:
        nextStatus === "ACTIVE" ? "Activate company" : "Suspend company",
      description: `Are you sure you want to ${
        nextStatus === "ACTIVE" ? "activate" : "suspend"
      } ${company.name}?`,
      confirmLabel: nextStatus === "ACTIVE" ? "Activate" : "Suspend",
      destructive: nextStatus === "SUSPENDED",
      onConfirm: async () => {
        try {
          await updateStatus.mutateAsync({
            companyId: company.id,
            status: nextStatus,
          });
          toast.success(
            `Company ${nextStatus === "ACTIVE" ? "activated" : "suspended"} successfully.`,
          );
        } catch (error) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Could not update company status.",
          );
        }
      },
    });
  }

  function removeCompany(company: AdminCompany) {
    confirm({
      title: "Delete company",
      description: `Delete company "${company.name}"? This action may be irreversible.`,
      confirmLabel: "Delete",
      destructive: true,
      onConfirm: async () => {
        try {
          await deleteCompany.mutateAsync(company.id);
          toast.success("Company deleted successfully.");
        } catch (error) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Could not delete company.",
          );
        }
      },
    });
  }

  return (
    <div className="space-y-6">
      {dialog}

      <PageHeader
        title="Manage Companies"
        description="Review organizations and manage their platform access."
      />

      <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2">
        <input
          className={inputClass}
          placeholder="Search company or recruiter..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          className={inputClass}
          value={status}
          onChange={(event) =>
            setStatus(event.target.value as CompanyStatus | "")
          }
        >
          <option value="">All company statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState
          message={
            error instanceof Error
              ? error.message
              : "Unable to load companies."
          }
        />
      ) : (
        <TableShell>
          <thead>
            <tr>
              <th className={thClass}>Company</th>
              <th className={thClass}>Recruiter</th>
              <th className={thClass}>Status</th>
              <th className={thClass}>Created</th>
              <th className={thClass}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {companies.map((company) => (
              <tr
                key={company.id}
                className="hover:bg-slate-50/70"
              >
                <td className={tdClass}>
                  <p className="font-semibold text-slate-900">
                    {company.name}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    ID: {company.id}
                  </p>
                </td>

                <td className={tdClass}>
                  <p>{company.recruiter?.name ?? "—"}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {company.recruiter?.email ?? ""}
                  </p>
                </td>

                <td className={tdClass}>
                  <Badge value={company.status} />
                </td>

                <td className={tdClass}>
                  {formatDate(company.createdAt)}
                </td>

                <td className={tdClass}>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className={`${buttonClass} border border-slate-200 hover:bg-slate-100`}
                      disabled={
                        updateStatus.isPending ||
                        deleteCompany.isPending
                      }
                      onClick={() => toggleCompany(company)}
                    >
                      {company.status === "ACTIVE"
                        ? "Suspend"
                        : "Activate"}
                    </button>

                    <button
                      type="button"
                      className={`${buttonClass} bg-red-50 text-red-700 hover:bg-red-100`}
                      disabled={
                        updateStatus.isPending ||
                        deleteCompany.isPending
                      }
                      onClick={() => removeCompany(company)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {companies.length === 0 && (
              <tr>
                <td colSpan={5}>
                  <EmptyState message="No companies match your filters." />
                </td>
              </tr>
            )}
          </tbody>
        </TableShell>
      )}

      <p className="text-sm text-slate-500">
        {companies.length} compan
        {companies.length === 1 ? "y" : "ies"} found
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Assessments                                                                */
/* -------------------------------------------------------------------------- */

export function AdminAssessmentsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<AssessmentStatus | "">("");

  const { data, isLoading, isError, error } =
    useAdminAssessments({ search, status });

  const closeAssessment = useCloseAdminAssessment();

  const { confirm, dialog } = useConfirmDialog();

  const assessments = getList<AdminAssessment>(
    data,
    "assessments",
  );

  function closeItem(assessment: AdminAssessment) {
    confirm({
      title: "Close assessment",
      description: `Close assessment "${assessment.title}"? Candidates will no longer be able to attempt it.`,
      confirmLabel: "Close",
      destructive: true,
      onConfirm: async () => {
        try {
          await closeAssessment.mutateAsync(assessment.id);
          toast.success("Assessment closed successfully.");
        } catch (error) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Could not close this assessment.",
          );
        }
      },
    });
  }

  return (
    <div className="space-y-6">
      {dialog}

      <PageHeader
        title="Manage Assessments"
        description="Review platform assessments and close assessments when necessary."
      />

      <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2">
        <input
          className={inputClass}
          placeholder="Search assessments..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          className={inputClass}
          value={status}
          onChange={(event) =>
            setStatus(event.target.value as AssessmentStatus | "")
          }
        >
          <option value="">All assessment statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ACTIVE">Active</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState
          message={
            error instanceof Error
              ? error.message
              : "Unable to load assessments."
          }
        />
      ) : (
        <TableShell>
          <thead>
            <tr>
              <th className={thClass}>Assessment</th>
              <th className={thClass}>Recruiter</th>
              <th className={thClass}>Duration</th>
              <th className={thClass}>Marks</th>
              <th className={thClass}>Activity</th>
              <th className={thClass}>Status</th>
              <th className={thClass}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {assessments.map((assessment) => (
              <tr
                key={assessment.id}
                className="hover:bg-slate-50/70"
              >
                <td className={tdClass}>
                  <p className="font-semibold text-slate-900">
                    {assessment.title}
                  </p>
                  <p className="mt-1 max-w-xs truncate text-xs text-slate-500">
                    {assessment.description || "No description"}
                  </p>
                </td>

                <td className={tdClass}>
                  {assessment.recruiter?.name ?? "—"}
                </td>

                <td className={tdClass}>
                  {assessment.duration} min
                </td>

                <td className={tdClass}>
                  {assessment.totalMarks}
                </td>

                <td className={tdClass}>
                  <p>{assessment._count?.problems ?? 0} problems</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {assessment._count?.invitations ?? 0} invitations
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {assessment._count?.attempts ?? 0} attempts
                  </p>
                </td>

                <td className={tdClass}>
                  <Badge value={assessment.status} />
                </td>

                <td className={tdClass}>
                  {assessment.status !== "CLOSED" &&
                  assessment.status !== "DRAFT" ? (
                    <button
                      type="button"
                      className={`${buttonClass} bg-red-50 text-red-700 hover:bg-red-100`}
                      disabled={closeAssessment.isPending}
                      onClick={() => closeItem(assessment)}
                    >
                      Close
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400">
                      {assessment.status === "CLOSED"
                        ? "Already closed"
                        : "Not published"}
                    </span>
                  )}
                </td>
              </tr>
            ))}

            {assessments.length === 0 && (
              <tr>
                <td colSpan={7}>
                  <EmptyState message="No assessments match your filters." />
                </td>
              </tr>
            )}
          </tbody>
        </TableShell>
      )}

      <p className="text-sm text-slate-500">
        {assessments.length} assessment
        {assessments.length === 1 ? "" : "s"} found
      </p>
    </div>
  );
}