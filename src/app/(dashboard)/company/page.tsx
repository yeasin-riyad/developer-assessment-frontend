import { CompanyProfile } from "@/features/company/components/company-profile";

export default function CompanyPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Company
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage your company profile and information.
        </p>
      </div>

      <CompanyProfile />
    </div>
  );
}