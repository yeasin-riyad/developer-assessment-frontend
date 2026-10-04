export interface Candidate {
  id: string;
  name: string;
  email: string;
  role: "CANDIDATE";
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
  data: Candidate[];
  pagination: CandidatePagination;
}