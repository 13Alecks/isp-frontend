import axios from "axios";
import { getSession } from "next-auth/react";
import { apiClient } from "@/config/api-client";

type QueryParamValue = string | number | boolean;

export type RequestProps = {
  url: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: Record<string, unknown> | FormData | object;
  auth?: "include" | "omit" | "required";
  params?: Record<string, QueryParamValue | null | undefined>;
  responseType?: "json" | "text" | "blob" | "arraybuffer";
};

export type ApiResponse<T = unknown> = {
  data?: T;
  error?: string;
  success: boolean;
  status?: number;
};

export async function requestApi<T = unknown>({
  url,
  method,
  body,
  auth = "include",
  params,
  responseType = "json",
}: RequestProps): Promise<ApiResponse<T>> {
  try {
    const headers: Record<string, string> = {};

    if (body && !(body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    if (auth !== "omit") {
      const session = await getSession();
      if (session?.user?.token) {
        headers["Authorization"] = `Bearer ${session.user.token}`;
      } else if (auth === "required") {
        return {
          success: false,
          error: "Authentication required",
          status: 401,
        };
      }
    }

    const response = await apiClient.request<T>({
      url,
      method,
      data: body,
      params,
      headers,
      responseType,
    });

    return {
      data: response.data,
      success: true,
      status: response.status,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const responseData = error.response?.data;
      let errorMessage = `Request failed with status ${status ?? "unknown"}`;
      if (
        responseData &&
        typeof responseData === "object" &&
        "message" in responseData &&
        typeof responseData.message === "string"
      ) {
        errorMessage = responseData.message;
      }

      return {
        success: false,
        data: responseData as T,
        error: errorMessage,
        status,
      };
    }

    const message =
      error instanceof Error ? error.message : "Unexpected request error.";
    return { success: false, error: message };
  }
}
