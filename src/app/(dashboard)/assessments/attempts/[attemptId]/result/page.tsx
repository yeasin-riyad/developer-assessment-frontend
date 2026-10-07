import { CandidateResultPage } from "@/features/results/components/candidate-result-page";

interface ResultPageProps {
  params: Promise<{
    attemptId: string;
  }>;
}

export default async function ResultPage({
  params,
}: ResultPageProps) {
  const { attemptId } = await params;

  return (
    <CandidateResultPage
      attemptId={attemptId}
    />
  );
}