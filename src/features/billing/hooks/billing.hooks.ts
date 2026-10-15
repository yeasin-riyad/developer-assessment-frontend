import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { billingApi } from "../api/billing.api";

import type {
  PaidPlanCode,
} from "../types/billing.types";

export const billingQueryKeys = {
  all: ["billing"] as const,

  plans: () =>
    [...billingQueryKeys.all, "plans"] as const,

  mySubscription: () =>
    [...billingQueryKeys.all, "my-subscription"] as const,
};

export function useBillingPlans() {
  return useQuery({
    queryKey: billingQueryKeys.plans(),
    queryFn: billingApi.getPlans,
    staleTime: 5 * 60 * 1000,
  });
}

export function useMySubscription(
  enabled = true,
) {
  return useQuery({
    queryKey: billingQueryKeys.mySubscription(),
    queryFn: billingApi.getMySubscription,
    enabled,
  });
}

export function useCreateCheckout() {
  return useMutation({
    mutationFn: (plan: PaidPlanCode) =>
      billingApi.createCheckout(plan),
  });
}

export function useRefreshMySubscription() {
  const queryClient = useQueryClient();

  return () =>
    queryClient.invalidateQueries({
      queryKey: billingQueryKeys.mySubscription(),
    });
}