import request from "@/lib/api";
import { CreatorDashboardResponse } from "./types";


const CREATOR_URL = "/creator";

export const creatorApi = {
  getDashboardStatistics: () =>
    request<CreatorDashboardResponse>(`${CREATOR_URL}/dashboard/statistics`),
};
