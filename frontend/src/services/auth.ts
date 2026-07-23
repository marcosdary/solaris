import { settings } from "../config/settings";
import type {
  ILoginInput,
  IRegisterInput,
  IAuthResponse,
  IForgotPasswordInput,
  IForgotPasswordResponse,
  IResetPasswordInput,
  IResetPasswordResponse,
} from "../types/auth";
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

export async function resetPassword(data: IResetPasswordInput): Promise<IResetPasswordResponse> {
  return request<IResetPasswordResponse>(`${settings.baseURL}/api/v1/auth/password/reset`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
