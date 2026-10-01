import { useMutation } from "@tanstack/react-query";

import {
  loginUser,
  registerUser,
} from "./api";

export function useRegister() {
  return useMutation({
    mutationFn: registerUser,
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: loginUser,
  });
}