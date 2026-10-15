
import Link from "next/link";
import {
  XCircle,
  ArrowLeft,
  RefreshCw,
  ReceiptText,
  ShieldAlert,
} from "lucide-react";

type SearchParams = Promise<{
  tran_id?: string | string[];
  reason?: string | string[];
}>;

type PageProps = {
  searchParams: SearchParams;
};

export default async function BillingFailedPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;

  const getParam = (value?: string | string[]) =>
    Array.isArray(value) ? value[0] : value;

  const transactionId = getParam(params.tran_id);
  const reason = getParam(params.reason);

  const reasonMessage =
    reason === "missing_payment_reference"
      ? "The payment gateway did not return the required payment references."
      : "We could not confirm your payment. Please check your payment history before trying again.";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-12 dark:bg-slate-950">
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-rose-200/30 blur-3xl dark:bg-rose-500/10" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-amber-200/30 blur-3xl dark:bg-amber-500/10" />

      <section className="relative w-full max-w-lg">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
          <div className="px-6 pb-7 pt-10 text-center sm:px-10">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-rose-50 ring-8 ring-rose-50/60 dark:bg-rose-950 dark:ring-rose-950/50">
              <XCircle
                className="h-14 w-14 text-rose-600 dark:text-rose-400"
                strokeWidth={1.8}
              />
            </div>

            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 dark:bg-rose-950 dark:text-rose-400">
              <ShieldAlert className="h-4 w-4" />
              Payment Not Confirmed
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Payment Unsuccessful
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
              {reasonMessage}
            </p>
          </div>

          <div className="mx-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950 sm:mx-8">
            <div className="mb-4 flex items-center gap-2">
              <ReceiptText className="h-5 w-5 text-rose-600 dark:text-rose-400" />
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
                  Payment Status
                </span>
                <span className="text-sm font-semibold text-rose-600 dark:text-rose-400">
                  Not Confirmed
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3 px-6 py-7 sm:px-8">
            <Link
              href="/billing"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
            >
              <RefreshCw className="h-5 w-5" />
              Return to Billing
            </Link>

            <Link
              href="/dashboard"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>

            <p className="pt-2 text-center text-xs leading-5 text-slate-400">
              If money was deducted, please check your payment history
              before retrying. Contact support if the issue persists.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
