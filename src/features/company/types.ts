export enum CompanyStatus {
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
}

export interface Company {
  id: string;
  name: string;
  description?: string | null;
  website?: string | null;
  logo?: string | null;
  status: CompanyStatus;
  recruiterId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompanyPayload {
  name: string;
  description?: string;
  website?: string;
  logo?: string;
}

export interface CreateCompanyResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Company;
}

export interface GetMyCompanyResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Company;
}