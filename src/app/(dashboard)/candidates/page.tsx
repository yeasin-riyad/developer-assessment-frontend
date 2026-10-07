import { Users } from "lucide-react";

import { CandidateList } from "@/features/candidates/components/candidate-list";

export default function CandidatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-2.5">
          <Users className="h-5 w-5 text-primary" />
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Candidates
          </h1>

          <p className="text-sm text-muted-foreground">
            View candidates and track their assessment
            activity.
          </p>
        </div>
      </div>

      <CandidateList />
    </div>
  );
}