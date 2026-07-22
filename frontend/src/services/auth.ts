import { settings } from "../config/settings";
import type { ILoginInput, IRegisterInput, IAuthResponse } from "../types/auth";
import { request } from "./apiClient";

export async function login(data: ILoginInput): Promise<IAuthResponse> {
  return request<IAuthResponse>(`${settings.baseURL}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function register(data: IRegisterInput): Promise<IAuthResponse> {
  return request<IAuthResponse>(`${settings.baseURL}/api/v1/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
