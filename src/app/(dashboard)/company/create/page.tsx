import { CompanyForm } from "@/features/company/components/company-form";

export default function CreateCompanyPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Create Company
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Create your company profile before creating
          assessments.
        </p>
      </div>

      <CompanyForm />
    </div>
  );
}