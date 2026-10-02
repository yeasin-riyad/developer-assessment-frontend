import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function WrittenProblemSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Written Response</CardTitle>

        <CardDescription>
          Candidates will provide a written answer to
          this question. The response will be manually
          evaluated.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="rounded-lg bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground">
            No additional configuration is required for
            written problems.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}