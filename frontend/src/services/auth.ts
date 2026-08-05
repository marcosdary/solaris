import { settings } from "../config/settings";
import type {
  ILoginInput,
  IRegisterInput,
  IAuthResponse,
  IForgotPasswordInput,
  IForgotPasswordResponse,
  IResetPasswordInput,
  IResetPasswordResponse,
  IGoogleLoginInput,
} from "../types/auth";
import type {
  IUserInfoResponse,
} from "../types/user";

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

export async function forgotPassword(data: IForgotPasswordInput): Promise<IForgotPasswordResponse> {
  return request<IForgotPasswordResponse>(`${settings.baseURL}/api/v1/auth/password/forgot`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function getMe(token?: string): Promise<IUserInfoResponse>{
  return request<IUserInfoResponse>(`${settings.baseURL}/api/v1/auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}

export async function resetPassword(data: IResetPasswordInput): Promise<IResetPasswordResponse> {
  return request<IResetPasswordResponse>(`${settings.baseURL}/api/v1/auth/password/reset`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function googleLogin(data: IGoogleLoginInput): Promise<IAuthResponse> {
  return request<IAuthResponse>(`${settings.baseURL}/api/v1/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
