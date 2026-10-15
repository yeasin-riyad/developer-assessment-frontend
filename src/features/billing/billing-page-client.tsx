
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  Check,
  CreditCard,
  Loader2,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ApiError } from "@/lib/api";
import { useAuth } from "@/providers/auth.provider";
import {
  useBillingPlans,
  useCreateCheckout,
  type BillingPlan,
  type PaidPlanCode,
} from "@/features/billing";

const FEATURES: Record<PaidPlanCode, string[]> = {
  STARTER: [
    "Access to available assessments",
    "Starter subscription benefits",
    "30-day subscription",
  ],
  PRO: [
    "All Starter plan features",
    "Pro subscription benefits",
    "30-day subscription",
  ],
};

const PLAN_DETAILS: Record<
  PaidPlanCode,
  {
    description: string;
    icon: typeof Zap;
    popular?: boolean;
  }
> = {
  STARTER: {
    description: "A great starting point for your assessment journey.",
    icon: Zap,
  },
  PRO: {
    description: "Get the complete experience with Pro benefits.",
    icon: Sparkles,
    popular: true,
  },
};

const formatPrice = (amount: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);

function getSafeCheckoutUrl(value: string): string | null {
  try {
    const url = new URL(value);

    const allowedHosts = [
      "sandbox.sslcommerz.com",
      "securepay.sslcommerz.com",
    ];

    if (url.protocol !== "https:" || !allowedHosts.includes(url.hostname)) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

export default function BillingPageClient() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const plansQuery = useBillingPlans();
  const checkoutMutation = useCreateCheckout();

  const [selectedPlan, setSelectedPlan] =
    useState<PaidPlanCode | null>(null);
  const [checkoutError, setCheckoutError] = useState("");

  // Display only paid plans.
  const plans: BillingPlan[] = (plansQuery.data?.data ?? []).filter(
    (plan): plan is BillingPlan =>
      plan.plan === "STARTER" || plan.plan === "PRO",
  );

  const handleBack = () => {
    // No previous browser history: use a sensible fallback.
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push(isAuthenticated ? "/dashboard" : "/login");
  };

  const handleCheckout = async (plan: PaidPlanCode) => {
    setSelectedPlan(plan);
    setCheckoutError("");

    try {
      const response = await checkoutMutation.mutateAsync(plan);
      const checkoutUrl = response.data?.checkoutUrl;

      if (!checkoutUrl) {
        throw new Error("Checkout URL was not returned by the server.");
      }

      const safeUrl = getSafeCheckoutUrl(checkoutUrl);

      if (!safeUrl) {
        throw new Error("The payment gateway URL is invalid.");
      }

      window.location.assign(safeUrl);
    } catch (error) {
      if (error instanceof ApiError) {
        setCheckoutError(error.message);
      } else if (error instanceof Error) {
        setCheckoutError(error.message);
      } else {
        setCheckoutError(
          "Unable to start checkout. Please try again.",
        );
      }

      setSelectedPlan(null);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Back button only */}
        <div className="mb-8">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            className="gap-2"
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
        </div>

        {/* Page heading */}
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700">
            <ShieldCheck className="size-4" />
            Secure subscription
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Choose Your Plan
          </h1>

          <p className="mt-4 text-base leading-7 text-slate-600">
            Select the subscription that works best for you and continue
            to secure payment.
          </p>
        </div>

        {/* Loading */}
        {plansQuery.isPending && (
          <div className="flex min-h-48 items-center justify-center">
            <Loader2 className="size-8 animate-spin text-indigo-600" />
            <span className="ml-3 text-sm text-slate-600">
              Loading subscription plans...
            </span>
          </div>
        )}

        {/* Plan loading error */}
        {plansQuery.isError && (
          <div className="mx-auto max-w-xl rounded-xl border border-red-200 bg-red-50 p-5 text-center">
            <p className="font-medium text-red-700">
              Unable to load subscription plans.
            </p>
            <p className="mt-2 text-sm text-red-600">
              Please check your connection and try again.
            </p>
            <Button
              className="mt-4"
              variant="outline"
              onClick={() => plansQuery.refetch()}
            >
              Try again
            </Button>
          </div>
        )}

        {/* Empty plans */}
        {!plansQuery.isPending &&
          !plansQuery.isError &&
          plans.length === 0 && (
            <div className="mx-auto max-w-xl rounded-xl border border-slate-200 bg-white p-8 text-center">
              <p className="font-semibold text-slate-900">
                No paid plans are currently available.
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Please try again later.
              </p>
            </div>
          )}

        {/* Checkout error */}
        {checkoutError && (
          <div
            role="alert"
            className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {checkoutError}
          </div>
        )}

        {/* Plan cards */}
        {!plansQuery.isPending &&
          !plansQuery.isError &&
          plans.length > 0 && (
            <div className="mx-auto grid max-w-4xl grid-cols-1 items-stretch gap-6 md:grid-cols-2">
              {plans.map((plan) => {
                const details = PLAN_DETAILS[plan.plan];
                const PlanIcon = details.icon;
                const isSelected = selectedPlan === plan.plan;
                const isLoading =
                  checkoutMutation.isPending && isSelected;

                return (
                  <Card
                    key={plan.plan}
                    className={`relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all ${
                      details.popular
                        ? "border-2 border-indigo-600 shadow-indigo-100"
                        : "border border-slate-200"
                    }`}
                  >
                    {details.popular && (
                      <div className="bg-indigo-600 px-4 py-2 text-center text-sm font-semibold text-white">
                        Most Popular
                      </div>
                    )}

                    <CardContent className="flex flex-1 flex-col p-6 sm:p-8">
                      <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                        <PlanIcon className="size-6" />
                      </div>

                      <h2 className="text-2xl font-bold text-slate-900">
                        {plan.name}
                      </h2>

                      <p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">
                        {details.description}
                      </p>

                      <div className="mt-6 flex items-baseline gap-2">
                        <span className="text-4xl font-bold tracking-tight text-slate-900">
                          {formatPrice(plan.amount)}
                        </span>
                        <span className="text-sm text-slate-500">
                          / {plan.durationDays} days
                        </span>
                      </div>

                      <div className="my-7 border-t border-slate-200" />

                      <ul className="flex-1 space-y-4">
                        {FEATURES[plan.plan].map((feature) => (
                          <li
                            key={feature}
                            className="flex items-start gap-3 text-sm text-slate-700"
                          >
                            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                              <Check className="size-3.5" />
                            </span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        type="button"
                        className="mt-8 w-full gap-2"
                        variant={details.popular ? "default" : "outline"}
                        disabled={checkoutMutation.isPending}
                        onClick={() => handleCheckout(plan.plan)}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="size-4 animate-spin" />
                            Redirecting...
                          </>
                        ) : (
                          <>
                            <CreditCard className="size-4" />
                            Choose {plan.name}
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

        {/* Payment security note */}
        <div className="mt-10 flex items-center justify-center gap-2 text-center text-sm text-slate-500">
          <ShieldCheck className="size-4 shrink-0 text-emerald-600" />
          <span>
            You will be redirected to SSLCOMMERZ for secure payment.
          </span>
        </div>
      </div>
    </main>
  );
}
