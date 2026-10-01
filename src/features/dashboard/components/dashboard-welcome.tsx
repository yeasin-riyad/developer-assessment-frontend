import type { AuthUser } from "@/features/auth";

interface DashboardWelcomeProps {
  user: AuthUser;
}

export function DashboardWelcome({
  user,
}: DashboardWelcomeProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
        Dashboard
      </h1>

      <p className="mt-1 text-sm text-muted-foreground">
        Welcome back,{" "}
        <span className="font-medium text-foreground">
          {user.name}
        </span>
        . Here&apos;s an overview of your
        workspace.
      </p>
    </div>
  );
}