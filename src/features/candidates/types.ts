// features/candidates/types.ts

export interface Candidate {
  id: string;
  name: string;
  email: string;
  role: "CANDIDATE";
  isActive: boolean;
  createdAt: string;
}

export interface CandidateQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface CandidatePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface GetCandidatesResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    candidates: Candidate[];
    pagination: CandidatePagination;
  };
}

export interface CandidateActivityQuery {
  page?: number;
  limit?: number;
}

export interface CandidateAssessmentQuery {
  page?: number;
  limit?: number;
}

export interface CandidateRecruiter {
  id: string;
  name: string;
  email: string;
  company?: {
    id: string;
    name: string;
    logo?: string | null;
  } | null;
}

export interface CandidateAssessment {
  id: string;
  title: string;
  duration: number;
  totalMarks: number;
  status: string;
  recruiter?: CandidateRecruiter | null;
}

export interface CandidateAttempt {
  id: string;
  status: string;
  score: number;
  startedAt?: string | null;
  submittedAt?: string | null;
  expiresAt?: string | null;
}

export interface CandidateResult {
  id: string;
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  status: string;
}

export interface CandidateActivity {
  id: string;
  status: string;
  expiresAt?: string | null;
  createdAt: string;

  assessment: CandidateAssessment;

  attempt?: CandidateAttempt | null;

  result?: CandidateResult | null;
}

export interface CandidateActivityResponse {
  candidate: Candidate;
  activities: CandidateActivity[];
  pagination: CandidatePagination;
}

export interface CandidateAssessmentHistory {
  id: string;
  status: string;
  score: number;
  startedAt?: string | null;
  submittedAt?: string | null;
  expiresAt?: string | null;

  assessment: CandidateAssessment;

  result?: CandidateResult | null;
}

export interface CandidateAssessmentResponse {
  data:{
    candidate: Candidate;
  assessments: CandidateAssessmentHistory[];
  pagination: CandidatePagination;
  }
}

// export interface CandidateDetails {
//   id: string;
//   name: string;
//   email: string;
//   role: string;
//   isActive: boolean;
//   createdAt: string;

//   _count?: {
//     invitations?: number;
//     attempts?: number;
//   };
// }

export interface CandidateDetails {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    _count?: {
      invitations?: number;
      attempts?: number;
    };
  };
}