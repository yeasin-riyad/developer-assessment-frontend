export type AdminRole =
  | "CANDIDATE"
  | "RECRUITER"
  | "CREATOR"
  | "EVALUATOR"
  | "ADMIN";

export type CompanyStatus = "ACTIVE" | "SUSPENDED";

export type AssessmentStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "ACTIVE"
  | "CLOSED";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  company?: {
    id: string;
    name: string;
  } | null;
  _count?: {
    problems?: number;
    assessments?: number;
    invitations?: number;
    attempts?: number;
    evaluations?: number;
  };
}

export interface AdminCompany {
  id: string;
  name: string;
  status: CompanyStatus;
  createdAt: string;
  updatedAt?: string;
  recruiter?: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export interface AdminAssessment {
  id: string;
  title: string;
  description?: string | null;
  duration: number;
  totalMarks: number;
  status: AssessmentStatus;
  createdAt: string;
  updatedAt?: string;
  recruiter?: {
    id: string;
    name: string;
    email?: string;
  } | null;
  _count?: {
    problems?: number;
    invitations?: number;
    attempts?: number;
  };
}

export interface AdminStatistics {
  users: {
    total: number;
    candidates: number;
    recruiters: number;
    creators: number;
    evaluators: number;
    admins: number;
  };
  companies: {
    total: number;
    active: number;
    suspended: number;
  };
  problems: {
    total: number;
    mcq: number;
    written: number;
  };
  assessments: {
    total: number;
    draft: number;
    published: number;
    active: number;
    closed: number;
  };
  activity: {
    totalInvitations: number;
    totalAttempts: number;
    totalSubmissions: number;
    totalEvaluations: number;
  };
  results: {
    total: number;
    passed: number;
    failed: number;
  };
}

export type ProblemType = "MCQ" | "WRITTEN";

export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface AdminProblemQuery {
  type?: ProblemType | "";
  difficulty?: Difficulty | "";
  search?: string;
}

export interface AdminProblemCreator {
  id: string;
  name: string;
  email: string;
  role?: AdminRole;
  isActive?: boolean;
}

export interface AdminProblemOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface AdminProblemTestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  createdAt: string;
}

export interface AdminProblemAssessmentUsage {
  id: string;
  order: number;
  points: number;
  assessment: {
    id: string;
    title: string;
    status: string;
  };
}

export interface AdminProblem {
  id: string;
  title: string;
  description: string;
  type: ProblemType;
  difficulty: Difficulty;
  points: number;
  createdBy: AdminProblemCreator;

  options?: AdminProblemOption[];

  testCases?: AdminProblemTestCase[];

  assessmentProblems?: AdminProblemAssessmentUsage[];

  _count: {
    options?: number;
    testCases?: number;
    assessmentProblems?: number;
    submissions?: number;
    attemptAnswers?: number;
    resultItems?: number;
  };

  createdAt: string;
  updatedAt: string;
}