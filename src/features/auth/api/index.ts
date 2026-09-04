import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/config/api-client";
import type { LoginPayload, AuthSession } from "@/features/auth/types";

async function login(payload: LoginPayload): Promise<AuthSession> {
  const { data } = await apiClient.post<AuthSession>("/auth/login", payload);
  return data;
}

export function useLogin() {
  return useMutation({
    mutationFn: login,
  });
}