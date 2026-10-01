import { ofetch, type FetchOptions } from "ofetch";

import {
  getAccessToken,
  removeAccessToken,
  setAccessToken,
} from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error(
    "NEXT_PUBLIC_API_URL is not configured",
  );
}

type ApiOptions = FetchOptions<"json"> & {
  _retry?: boolean;
};

const rawApi = ofetch.create({
  baseURL: API_URL,
  credentials: "include",

  headers: {
    "Content-Type": "application/json",
  },
});

let refreshPromise: Promise<string | null> | null = null;

async function refreshToken(): Promise<string | null> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const response = await rawApi<{
        success: boolean;
        message: string;
        data: {
          accessToken: string;
        };
      }>("/auth/refresh-token", {
        method: "POST",
      });

      const newAccessToken =
        response.data.accessToken;

      if (!newAccessToken) {
        throw new Error(
          "Refresh token response did not contain an access token",
        );
      }

      setAccessToken(newAccessToken);

      return newAccessToken;
    } catch {
      removeAccessToken();

      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

async function request<T>(
  url: string,
  options: ApiOptions = {},
): Promise<T> {
  const accessToken = getAccessToken();

  const headers = new Headers(
    options.headers as HeadersInit | undefined,
  );

  if (accessToken) {
    headers.set(
      "Authorization",
      `Bearer ${accessToken}`,
    );
  }

  try {
    return await rawApi<T>(url, {
      ...options,
      headers,
    });
  } catch (error: unknown) {
    const status =
      error &&
      typeof error === "object" &&
      "response" in error
        ? (
            error as {
              response?: {
                status?: number;
              };
            }
          ).response?.status
        : undefined;

    const alreadyRetried = options._retry === true;

    const isRefreshRequest =
      url === "/auth/refresh-token";

    if (
      status !== 401 ||
      alreadyRetried ||
      isRefreshRequest
    ) {
      throw error;
    }

    const newAccessToken =
      await refreshToken();

    if (!newAccessToken) {
      throw error;
    }

    const retryHeaders = new Headers(
      options.headers as HeadersInit | undefined,
    );

    retryHeaders.set(
      "Authorization",
      `Bearer ${newAccessToken}`,
    );

    return rawApi<T>(url, {
      ...options,
      retry: 6,
      headers: retryHeaders,
    });
  }
}

export default request;