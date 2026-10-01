import { Separator } from "@/components/ui/separator";

export function AuthDivider() {
  return (
    <div className="relative">
      <Separator />

      <div className="absolute inset-0 flex items-center justify-center">
        <span className="bg-background px-3 text-xs uppercase tracking-wide text-muted-foreground">
          Or continue with email
        </span>
      </div>
    </div>
  );
}