import { useQuery } from "@tanstack/react-query";

import { getCurrentUser } from "./api";

export const userQueryKeys = {
  all: ["users"] as const,
  me: () => [...userQueryKeys.all, "me"] as const,
};

export function useCurrentUser() {
  return useQuery({
    queryKey: userQueryKeys.me,
    queryFn: getCurrentUser,
    enabled:
      typeof window !== "undefined" &&
      Boolean(localStorage.getItem("accessToken")),
    retry: false,
  });
}