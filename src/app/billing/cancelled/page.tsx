
import Link from "next/link";
import {
  Ban,
  ArrowLeft,
  RefreshCw,
  ReceiptText,
  ShieldAlert,
  CreditCard,
} from "lucide-react";

type SearchParams = Promise<{
  tran_id?: string | string[];
}>;

type PageProps = {
  searchParams: SearchParams;
};

export default async function BillingCancelledPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;

  const rawTransactionId = params.tran_id;
  const transactionId = Array.isArray(rawTransactionId)
    ? rawTransactionId[0]
    : rawTransactionId;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-12 dark:bg-slate-950">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-amber-200/30 blur-3xl dark:bg-amber-500/10" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-200/30 blur-3xl dark:bg-indigo-500/10" />

      <section className="relative w-full max-w-lg">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
          {/* Header */}
          <div className="px-6 pb-7 pt-10 text-center sm:px-10">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-amber-50 ring-8 ring-amber-50/60 dark:bg-amber-950 dark:ring-amber-950/50">
              <Ban
                className="h-12 w-12 text-amber-600 dark:text-amber-400"
                strokeWidth={1.8}
              />
            </div>

            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:bg-amber-950 dark:text-amber-400">
              <ShieldAlert className="h-4 w-4" />
              Checkout Cancelled
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Payment Cancelled
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
              You cancelled the checkout process before completing
              your payment. No further action was taken on this page.
              You can return to billing whenever you are ready.
            </p>
          </div>

          {/* Transaction details */}
          <div className="mx-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950 sm:mx-8">
            <div className="mb-4 flex items-center gap-2">
              <ReceiptText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="font-semibold text-slate-900 dark:text-white">
                Transaction Details
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <p className="mb-1 text-sm text-slate-500">
                  Transaction ID
                </p>

                <p className="break-all text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {transactionId || "Not available"}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800">
                <span className="text-sm text-slate-500">
                  Payment Gateway
                </span>

                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  SSLCOMMERZ
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800">
                <span className="text-sm text-slate-500">
                  Checkout Status
                </span>

                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 dark:text-amber-400">
                  <Ban className="h-4 w-4" />
                  Cancelled
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 px-6 py-7 sm:px-8">
            <Link
              href="/billing"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
            >
              <RefreshCw className="h-5 w-5" />
              Return to Billing
              <CreditCard className="ml-auto h-5 w-5" />
            </Link>

            <Link
              href="/dashboard"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>

            <p className="pt-2 text-center text-xs leading-5 text-slate-400">
              Changed your mind? You can select a subscription plan
              whenever you are ready.
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Need help? Please contact our support team.
        </p>
      </section>
    </main>
  );
}
