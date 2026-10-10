
export interface CreatorDashboardStatistics {
  problems: {
    total: number;
    mcq: number;
    written: number;
    coding: number;
  };
  assessments: {
    total: number;
  };
}

export interface CreatorDashboardResponse {
  success: boolean;
  message: string;
  data: CreatorDashboardStatistics;
}

