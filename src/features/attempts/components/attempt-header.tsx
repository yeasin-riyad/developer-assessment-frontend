import { AttemptTimer } from "./attempt-timer";

interface AttemptHeaderProps {
  title: string;
  expiresAt: string | null;
  onExpire: () => void;
}

export function AttemptHeader({
  title,
  expiresAt,
  onExpire,
}: AttemptHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Assessment
          </p>

          <h1 className="truncate text-lg font-semibold">
            {title}
          </h1>
        </div>

        <AttemptTimer
          expiresAt={expiresAt}
          onExpire={onExpire}
        />
      </div>
    </header>
  );
}