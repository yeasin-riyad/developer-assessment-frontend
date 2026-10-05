
import { CandidateInvitationList } from "@/features/invitations/components/candidate-invitation-list";

export default function CandidateInvitationsPage() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          My Invitations
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          View and manage assessment invitations sent
          to you.
        </p>
      </div>

      <CandidateInvitationList />
    </div>
  );
}

