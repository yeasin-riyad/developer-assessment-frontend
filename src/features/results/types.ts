export type ResultStatus = "PASS" | "FAIL";

export type ProblemType = "MCQ" | "WRITTEN";

export type Difficulty =
  | "EASY"
  | "MEDIUM"
  | "HARD";

export interface ResultProblem {
  id: string;
  title: string;
  type: ProblemType;
  difficulty: Difficulty;
}

export interface ResultItem {
  id: string;
  problemId: string;
  maximumMarks: number;
  obtainedMarks: number;
  problem: ResultProblem;
}

export interface ResultAttempt {
  id: string;
  candidateId: string;
  status: string;
  startedAt: string;
  submittedAt: string | null;
  assessment: {
    id: string;
    title: string;
    description: string | null;
    duration: number;
  };
}

export interface CandidateResult {
  id: string;
  attemptId: string;
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  status: ResultStatus;
  createdAt: string;
  items: ResultItem[];
  attempt: ResultAttempt;
}