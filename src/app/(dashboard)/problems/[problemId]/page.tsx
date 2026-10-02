import { ProblemDetails } from "@/features/problems";

interface ProblemDetailsPageProps {
  params: Promise<{
    problemId: string;
  }>;
}

export default async function ProblemDetailsPage({
  params,
}: ProblemDetailsPageProps) {
  const { problemId } = await params;

  return (
    <div className="space-y-8">
      <ProblemDetails problemId={problemId} />
    </div>
  );
}