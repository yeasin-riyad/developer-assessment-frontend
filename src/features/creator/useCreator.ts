"use client";

import {
  useQuery,
} from "@tanstack/react-query";
import { creatorApi } from "./api";


export const creatorQueryKeys = {
  all: ["creator"] as const,

  dashboardStatistics: () =>
    [...creatorQueryKeys.all, "dashboard-statistics"] as const,
};

export function useCreatorDashboardStatistics() {
  return useQuery({
    queryKey: creatorQueryKeys.dashboardStatistics(),

    queryFn: creatorApi.getDashboardStatistics,

    staleTime: 60 * 1000,
  });
}

