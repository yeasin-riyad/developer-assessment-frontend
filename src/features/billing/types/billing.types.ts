export type PaidPlanCode = "STARTER" | "PRO";

export type BillingPlan = {
  plan: PaidPlanCode;
  name: string;
  amount: number;
  currency: "BDT";
  durationDays: number;
};

export type SubscriptionStatus =
  | "PENDING"
  | "ACTIVE"
  | "EXPIRED"
  | "CANCELLED";

export type MySubscription = {
  id: string;
  plan: PaidPlanCode | "FREE";
  status: SubscriptionStatus;
  startDate: string | null;
  endDate: string | null;
  remainingDays?: number;
};

export type CheckoutData = {
  checkoutUrl: string;
  invoiceNumber: string;
  subscriptionId: string;
};

export type ApiResponse<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
};