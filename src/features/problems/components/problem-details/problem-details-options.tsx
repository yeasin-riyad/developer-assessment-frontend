import { CheckCircle2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { ProblemOption } from "@/features/problems";

interface ProblemDetailsOptionsProps {
  options: ProblemOption[];
}

export function ProblemDetailsOptions({
  options,
}: ProblemDetailsOptionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Answer Options</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {options.map((option, index) => (
            <div
              key={option.id}
              className={[
                "flex items-center gap-3 rounded-lg border p-4",
                option.isCorrect
                  ? "border-primary/40 bg-primary/5"
                  : "bg-background",
              ].join(" ")}
            >
              <div
                className={[
                  "flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-semibold",
                  option.isCorrect
                    ? "border-primary bg-primary text-primary-foreground"
                    : "text-muted-foreground",
                ].join(" ")}
              >
                {String.fromCharCode(65 + index)}
              </div>

              <p className="flex-1 text-sm">
                {option.text}
              </p>

              {option.isCorrect && (
                <div className="flex items-center gap-1.5 text-xs font-medium text-primary">
                  <CheckCircle2 className="size-4" />
                  Correct
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}