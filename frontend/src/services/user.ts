import { settings } from "../config/settings";

import type {
  IUserUpdateInput,
  IUserInfoResponse,
} from "../types/user";

import { request } from "./apiClient";

export async function updateMe(token?: string, data?: IUserUpdateInput): Promise<IUserInfoResponse>{
  return request<IUserInfoResponse>(`${settings.baseURL}/api/v1/auth/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
  });
}

export async function desactivateMe(token?: string): Promise<void> {
  return request<void>(`${settings.baseURL}/api/v1/auth/me/deactivate`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

export async function linkGoogleAccount(
  token?: string,
  data?: { access_token: string },
): Promise<IUserInfoResponse> {
  return request<IUserInfoResponse>(`${settings.baseURL}/api/v1/auth/me/google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
  });
}

