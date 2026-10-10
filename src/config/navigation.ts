import {
  BarChart3,
  ClipboardCheck,
  FileText,
  LayoutDashboard,
  Settings,
  Users,
  UserPlus,
  ClipboardList,
  Building2,
  ShieldCheck,
} from "lucide-react";

import { UserRole } from "@/features/auth";

export interface NavigationItem {
  title: string;
  href: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
  roles: UserRole[];
}

export const dashboardNavigation: NavigationItem[] = [
  // Dashboard
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: [
      UserRole.CANDIDATE,
      UserRole.CREATOR,
      UserRole.RECRUITER,
      UserRole.EVALUATOR,
      UserRole.ADMIN,
    ],
  },

  // Candidate
  {
    title: "Invitations",
    href: "/invitations/my",
    icon: UserPlus,
    roles: [UserRole.CANDIDATE],
  },
  {
    title: "Assessments",
    href: "/assessments/my",
    icon: ClipboardCheck,
    roles: [UserRole.CANDIDATE],
  },

  // Recruiter, Creator, Evaluator
  {
    title: "Assessments",
    href: "/assessments",
    icon: ClipboardCheck,
    roles: [UserRole.RECRUITER, UserRole.EVALUATOR],
  },

  // Problems
  {
    title: "Problems",
    href: "/problems",
    icon: FileText,
    roles: [
      UserRole.CREATOR,
      UserRole.RECRUITER,
      UserRole.EVALUATOR,
      UserRole.ADMIN,
    ],
  },

  // Candidates
  {
    title: "Candidates",
    href: "/candidates",
    icon: Users,
    roles: [UserRole.RECRUITER, UserRole.ADMIN],
  },

  // Recruiter
  {
    title: "Invitations",
    href: "/invitations",
    icon: UserPlus,
    roles: [UserRole.RECRUITER],
  },

  // Evaluator
  {
    title: "Evaluations",
    href: "/evaluations",
    icon: ClipboardList,
    roles: [UserRole.EVALUATOR],
  },

  // Reports
  // {
  //   title: "Reports",
  //   href: "/reports",
  //   icon: BarChart3,
  //   roles: [UserRole.RECRUITER, UserRole.EVALUATOR, UserRole.ADMIN],
  // },

  // Company
  {
    title: "Company",
    href: "/company",
    icon: Building2,
    roles: [UserRole.RECRUITER],
  },

  // Admin
  // {
  //   title: "Admin Dashboard",
  //   href: "/admin/dashboard",
  //   icon: LayoutDashboard,
  //   roles: [UserRole.ADMIN],
  // },
  {
    title: "Manage Users",
    href: "/dashboard/users",
    icon: Users,
    roles: [UserRole.ADMIN],
  },
  {
    title: "Manage Companies",
    href: "/dashboard/companies",
    icon: Building2,
    roles: [UserRole.ADMIN],
  },
  {
    title: "Manage Problems",
    href: "/dashboard/problems",
    icon: FileText,
    roles: [UserRole.ADMIN],
  },
  {
    title: "Manage Assessments",
    href: "/dashboard/admin-assessments",
    icon: ClipboardCheck,
    roles: [UserRole.ADMIN],
  },

  // Settings
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    roles: [
      UserRole.CANDIDATE,
      UserRole.CREATOR,
      UserRole.RECRUITER,
      UserRole.EVALUATOR,
      UserRole.ADMIN,
    ],
  },
];
