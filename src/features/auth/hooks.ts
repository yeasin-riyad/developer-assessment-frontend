import { useMutation } from "@tanstack/react-query";

import { registerUser } from "./api";

export function useRegister() {
  return useMutation({
    mutationFn: registerUser,
  });
}