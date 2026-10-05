"use client";

import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";

interface AttemptTimerProps {
  expiresAt: string;
  onExpire?: () => void;
}

function formatTime(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [
    hours.toString().padStart(2, "0"),
    minutes.toString().padStart(2, "0"),
    seconds.toString().padStart(2, "0"),
  ].join(":");
}

export function AttemptTimer({
  expiresAt,
  onExpire,
}: AttemptTimerProps) {
  const calculateRemaining = () =>
    Math.max(
      0,
      Math.floor(
        (new Date(expiresAt).getTime() - Date.now()) / 1000,
      ),
    );

  const [remainingSeconds, setRemainingSeconds] =
    useState(calculateRemaining);

  useEffect(() => {
    const updateTimer = () => {
      const remaining = calculateRemaining();

      setRemainingSeconds(remaining);

      if (remaining <= 0) {
        onExpire?.();
      }
    };

    updateTimer();

    const interval = window.setInterval(updateTimer, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [expiresAt, onExpire]);

  const isCritical = remainingSeconds <= 60;
  const isWarning = remainingSeconds <= 300;

  return (
    <div
      className={[
        "flex items-center gap-2 rounded-lg border px-4 py-2",
        isCritical
          ? "border-red-300 bg-red-50 text-red-700"
          : isWarning
            ? "border-amber-300 bg-amber-50 text-amber-700"
            : "border-slate-200 bg-white text-slate-700",
      ].join(" ")}
    >
      <Clock3 className="size-4" />

      <div className="flex flex-col">
        <span className="text-xs text-slate-500">
          Time remaining
        </span>

        <span className="font-mono text-sm font-semibold">
          {formatTime(remainingSeconds)}
        </span>
      </div>
    </div>
  );
}