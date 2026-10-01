import { useQuery } from "@tanstack/react-query";

import { getCurrentUser } from "./api";

export const userQueryKeys = {
  all: ["users"] as const,
  me: ["users", "me"] as const,
};

export function useCurrentUser(enabled: boolean) {
  return useQuery({
    queryKey: userQueryKeys.me,
    queryFn: getCurrentUser,
    enabled,
    retry: false,
  });
}