import request from "@/lib/api";

import type {
  ApiResponse,
  BillingPlan,
  CheckoutData,
  MySubscription,
  PaidPlanCode,
} from "../types/billing.types";

export const billingApi = {
  getPlans: () =>
    request<ApiResponse<BillingPlan[]>>(
      "/billing/plans",
      {
        method: "GET",
      },
    ),

  getMySubscription: () =>
    request<ApiResponse<MySubscription | null>>(
      "/billing/me",
      {
        method: "GET",
      },
    ),

  createCheckout: (plan: PaidPlanCode) =>
    request<ApiResponse<CheckoutData>>(
      "/billing/checkout",
      {
        method: "POST",
        body: {
          plan,
        },
      },
    ),
};