import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSession, signIn, signOut } from "next-auth/react";
import { requestApi } from "@/shared/api";
import {
  AuthSession,
  AuthUser,
  LoginPayload,
  UserSessionResponse,
} from "@/features/auth/types";

async function loginAuth(payload: LoginPayload): Promise<AuthSession> {
  const signInResult = await signIn("credentials", {
    redirect: false,
    flow: "login",
    email: payload.email,
    password: payload.password,
  });

  if (!signInResult || signInResult.error || !signInResult.ok) {
    throw new Error(signInResult?.error || "Login failed");
  }

  const session = await getSession();

  if (!session?.user?.token || !session.user) {
    throw new Error("Unexpected response");
  }

  return {
    status: "success",
    message: "Login successful",
    data: {
      token: session.user.token,
      user: session.user as unknown as AuthUser,
    },
  };
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: loginAuth,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}

const getUser = async (): Promise<UserSessionResponse["data"]> => {
  const result = await requestApi<UserSessionResponse>({
    url: "/auth/session-details",
    method: "GET",
  });

  if (!result.success || !result.data) {
    if (String(result?.data?.error).toLocaleLowerCase() === "jwt token expired") {
      signOut({ callbackUrl: "/login" });
    }
    throw new Error(result.error || "Failed to fetch user session");
  }

  return result.data?.data as UserSessionResponse["data"];
};

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    staleTime: 1000 * 60 * 5,
  });
};
