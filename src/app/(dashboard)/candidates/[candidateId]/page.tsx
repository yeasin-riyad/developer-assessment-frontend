import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

import { CandidateDetails } from "@/features/candidates/components/candidate-details";
import { CandidateActivityList } from "@/features/candidates/components/candidate-activity-list";
import { CandidateAssessmentList } from "@/features/candidates/components/candidate-assessment-list";

interface CandidatePageProps {
  params: Promise<{
    candidateId: string;
  }>;
}

export default async function CandidatePage({
  params,
}: CandidatePageProps) {
  const { candidateId } = await params;

  return (
    <div className="space-y-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="-ml-2"
        >
          <Link href="/candidates">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Candidates
          </Link>
        </Button>
      </div>

      <CandidateDetails
        candidateId={candidateId}
      />

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">
            Assessment History
          </h2>

          <p className="text-sm text-muted-foreground">
            Assessments attempted by this candidate.
          </p>
        </div>

        <CandidateAssessmentList
          candidateId={candidateId}
        />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">
            Activity
          </h2>

          <p className="text-sm text-muted-foreground">
            Invitations, attempts and result activity.
          </p>
        </div>

        <CandidateActivityList
          candidateId={candidateId}
        />
      </section>
    </div>
  );
}