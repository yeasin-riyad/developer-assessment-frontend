import { InvitationList } from "@/features/invitations/components/invitation-list";

export default function InvitationsPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Invitations
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage candidate invitations sent by you.
        </p>
      </div>

      <InvitationList />
    </div>
  );
}