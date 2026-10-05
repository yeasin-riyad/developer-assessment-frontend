import { AttemptPage } from "@/features/attempts/components/attempt-page";

interface AttemptRoutePageProps {
  params: Promise<{
    assessmentId: string;
    attemptId: string;
  }>;
}

export default async function AttemptRoutePage({
  params,
}: AttemptRoutePageProps) {
  const { attemptId } = await params;

  return <AttemptPage attemptId={attemptId} />;
}