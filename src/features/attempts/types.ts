export type AttemptStatusValue =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "SUBMITTED"
  | "EXPIRED";

export type ProblemType = "MCQ" | "WRITTEN";

export interface ProblemOption {
  id: string;
  text: string;
}

export interface AttemptProblem {
  id: string;
  title: string;
  description: string;
  type: ProblemType;
  difficulty: string;
  options: ProblemOption[];
}



export interface AssessmentProblem {
  id: string;
  assessmentId: string;
  problemId: string;
  order: number;
  problem: AttemptProblem;
}

export interface AttemptAssessment {
  id: string;
  title: string;
  duration: number;
  totalMarks: number;
}

export interface AttemptAnswer {
  id: string;
  attemptId: string;
  problemId: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
}

export interface Attempt {
  id: string;
  assessmentId: string;
  candidateId: string;
  status: AttemptStatusValue;
  startedAt: string | null;
  expiresAt: string | null;
  submittedAt: string | null;
  assessment?: AttemptAssessment;
  answers?: AttemptAnswer[];
}

export interface AttemptQuestionResponse {
  attemptId: string;
  status: "IN_PROGRESS";
  startedAt: string | null;
  expiresAt: string | null;

  assessment: AttemptAssessment;

  problems: AssessmentProblem[];
}

export interface AttemptStatus {
  id: string;
  status: AttemptStatusValue;
  startedAt: string | null;
  expiresAt: string | null;
  submittedAt: string | null;
}

export interface SaveAnswerPayload {
  problemId: string;
  answer: string;
}

export interface SubmitAttemptResponse {
  id: string;
  assessmentId: string;
  candidateId: string;
  status: AttemptStatusValue;
  startedAt: string | null;
  expiresAt: string | null;
  submittedAt: string | null;
}