import api from "@/lib/api";

import type {
  AddProblemPayload,
  AddProblemResponse,
  CreateAssessmentPayload,
  CreateAssessmentResponse,
  DeleteProblemResponse,
  GetAssessmentResponse,
  GetAssessmentsResponse,
  PublishAssessmentResponse,
  UpdateAssessmentPayload,
} from "./types";
import { GetProblemsResponse } from "../problems";

export async function createAssessment(
  payload: CreateAssessmentPayload,
): Promise<CreateAssessmentResponse> {
  return api<CreateAssessmentResponse>("/assessments", {
    method: "POST",
    body: payload,
  });
}

export async function getAssessments(): Promise<GetAssessmentsResponse> {
  return api<GetAssessmentsResponse>("/assessments", {
    method: "GET",
  });
}

export async function getAssessmentById(
  assessmentId: string,
): Promise<GetAssessmentResponse> {
  return api<GetAssessmentResponse>(
    `/assessments/${assessmentId}`,
    {
      method: "GET",
    },
  );
}

export async function updateAssessment(
  assessmentId: string,
  payload: UpdateAssessmentPayload,
): Promise<CreateAssessmentResponse> {
  return api<CreateAssessmentResponse>(
    `/assessments/${assessmentId}`,
    {
      method: "PATCH",
      body: payload,
    },
  );
}

export async function addProblemToAssessment(
  assessmentId: string,
  payload: AddProblemPayload,
): Promise<AddProblemResponse> {
  return api<AddProblemResponse>(
    `/assessments/${assessmentId}/problems`,
    {
      method: "POST",
      body: payload,
    },
  );
}

export async function removeProblemFromAssessment(
  assessmentId: string,
  problemId: string,
): Promise<DeleteProblemResponse> {
  return api<DeleteProblemResponse>(
    `/assessments/${assessmentId}/problems/${problemId}`,
    {
      method: "DELETE",
    },
  );
}

export async function publishAssessment(
  assessmentId: string,
): Promise<PublishAssessmentResponse> {
  return api<PublishAssessmentResponse>(
    `/assessments/${assessmentId}/publish`,
    {
      method: "PATCH",
    },
  );
}

export async function unpublishAssessment(
  assessmentId: string,
): Promise<PublishAssessmentResponse> {
  return api<PublishAssessmentResponse>(
    `/assessments/${assessmentId}/unpublish`,
    {
      method: "PATCH",
    },
  );
}




export async function getProblems(): Promise<GetProblemsResponse> {
  return api<GetProblemsResponse>("/problems", {
    method: "GET",
  });
}
