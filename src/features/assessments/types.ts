export enum AssessmentStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ACTIVE = "ACTIVE",
  CLOSED = "CLOSED",
}

export enum AssessmentProblemType {
  MCQ = "MCQ",
  WRITTEN = "WRITTEN",
}

export enum AssessmentProblemDifficulty {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD",
}

export interface AssessmentProblem {
  id: string;
  assessmentId: string;
  problemId: string;
  points?: number;
  order: number;

  problem: {
    id: string;
    title: string;
    description?: string;
    type: AssessmentProblemType;
    difficulty: AssessmentProblemDifficulty;
    points?: number;
  };
}

export interface Assessment {
  id: string;
  title: string;
  description?: string | null;
  duration: number;
  totalMarks: number;
  status: AssessmentStatus;
  recruiterId: string;
  createdAt: string;
  updatedAt: string;

  problems: AssessmentProblem[];
}

export interface CreateAssessmentPayload {
  title: string;
  description?: string;
  duration: number;
}

export interface UpdateAssessmentPayload {
  title?: string;
  description?: string;
  duration?: number;
}

export interface AddProblemPayload {
  problemId: string;
  points: number;
  order:number
}

export interface CreateAssessmentResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Assessment;
}

export interface GetAssessmentsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Assessment[];
}

export interface GetAssessmentResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Assessment;
}

export interface AddProblemResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: AssessmentProblem;
}

export interface DeleteProblemResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Assessment;
}

export interface PublishAssessmentResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Assessment;
}


export type CandidateAssessmentStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "SUBMITTED"
  | "EXPIRED";

export interface CandidateAssessment {
  attemptId: string;

  assessment: {
    id: string;
    title: string;
    duration: number;
    totalMarks: number;
    status: string;
  };

  status: CandidateAssessmentStatus;

  startedAt: string | null;
  expiresAt: string | null;
  submittedAt: string | null;

  answeredQuestions: number;
}