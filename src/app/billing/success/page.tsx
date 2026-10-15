
import Link from "next/link";
import {
  CheckCircle2,
  ArrowRight,
  LayoutDashboard,
  ShieldCheck,
  ReceiptText,
} from "lucide-react";

type SearchParams = Promise<{
  tran_id?: string | string[];
}>;

type PageProps = {
  searchParams: SearchParams;
};

export default async function BillingSuccessPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;

  const rawTransactionId = params.tran_id;
  const transactionId = Array.isArray(rawTransactionId)
    ? rawTransactionId[0]
    : rawTransactionId;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-12 dark:bg-slate-950">
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-emerald-200/30 blur-3xl dark:bg-emerald-500/10" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-200/30 blur-3xl dark:bg-indigo-500/10" />

      <section className="relative w-full max-w-lg">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
          <div className="px-6 pb-7 pt-10 text-center sm:px-10">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 ring-8 ring-emerald-50/60 dark:bg-emerald-950 dark:ring-emerald-950/50">
              <CheckCircle2
                className="h-14 w-14 text-emerald-600 dark:text-emerald-400"
                strokeWidth={1.8}
              />
            </div>

            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
              Payment Verified
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Payment Successful!
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">
              Your payment has been verified by our server.
              Thank you for subscribing to the Developer Assessment
              Platform. Your subscription is ready to use.
            </p>
          </div>

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
                  {transactionId || "Not provided"}
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
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  Verified
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3 px-6 py-7 sm:px-8">
            <Link
              href="/dashboard"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
            >
              <LayoutDashboard className="h-5 w-5" />
              Go to Dashboard
              <ArrowRight className="ml-auto h-5 w-5" />
            </Link>

            <Link
              href="/billing"
              className="flex h-12 w-full items-center justify-center rounded-xl border border-slate-200 px-4 font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              View Billing
            </Link>

            <p className="flex items-center justify-center gap-2 pt-2 text-xs text-slate-400">
              <ShieldCheck className="h-4 w-4" />
              Secure payment powered by SSLCOMMERZ
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Thank you for choosing our platform.
        </p>
      </section>
    </main>
  );
}
