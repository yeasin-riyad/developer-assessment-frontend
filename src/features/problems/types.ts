export enum ProblemType {
  CODING = "CODING",
  MCQ = "MCQ",
  WRITTEN = "WRITTEN",
}

export enum ProblemDifficulty {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD",
}

export interface ProblemQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: "MCQ" | "WRITTEN";
  difficulty?: "EASY" | "MEDIUM" | "HARD";
}

export interface ProblemOption {
  id: string;
  text: string;
  isCorrect: boolean;
  problemId?: string;
  createdAt?: string;
}

export interface ProblemTestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  problemId?: string;
  createdAt?: string;
}

export interface ProblemCreator {
  id: string;
  name: string;
  email?: string;
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  type: ProblemType;
  difficulty: ProblemDifficulty;
  points: number;
  createdById: string;
  createdAt: string;
  updatedAt?: string;

  options: ProblemOption[];
  testCases: ProblemTestCase[];

  createdBy?: ProblemCreator;
}

export interface CreateProblemOption {
  text: string;
  isCorrect: boolean;
}

export interface ProblemPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface CreateProblemTestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface CreateProblemPayload {
  title: string;
  description: string;
  type: ProblemType;
  difficulty: ProblemDifficulty;
  points: number;
  options?: CreateProblemOption[];
}

export interface CreateProblemResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Problem;
}

export interface GetProblemsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Problem[];
  pagination: ProblemPagination;
}

export interface GetProblemResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Problem;
}