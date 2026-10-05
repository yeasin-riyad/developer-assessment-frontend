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

  // Assessments
{
  title: "Assessments",
  href: "/assessments/my",
  icon: ClipboardCheck,
  roles: [UserRole.CANDIDATE],
},
{
  title: "Assessments",
  href: "/assessments",
  icon: ClipboardCheck,
  roles: [
    UserRole.RECRUITER,
    UserRole.CREATOR,
    UserRole.EVALUATOR,
  ],
},

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

  {
    title: "Candidates",
    href: "/candidates",
    icon: Users,
    roles: [
      UserRole.RECRUITER,
      UserRole.ADMIN,
    ],
  },

  // Recruiter
  {
    title: "Invitations",
    href: "/invitations",
    icon: UserPlus,
    roles: [UserRole.RECRUITER],
  },

  {
    title: "Evaluations",
    href: "/evaluations",
    icon: ClipboardList,
    roles: [UserRole.EVALUATOR],
  },

  {
    title: "Reports",
    href: "/reports",
    icon: BarChart3,
    roles: [
      UserRole.RECRUITER,
      UserRole.EVALUATOR,
      UserRole.ADMIN,
    ],
  },

  {
    title: "Company",
    href: "/company",
    icon: Building2,
    roles: [UserRole.RECRUITER],
  },

  {
    title: "Administration",
    href: "/admin/users",
    icon: ShieldCheck,
    roles: [UserRole.ADMIN],
  },

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