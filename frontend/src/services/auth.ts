import { settings } from "../config/settings";
import type { ILoginInput, IRegisterInput, IAuthResponse } from "../types/auth";

export async function login(data: ILoginInput): Promise<IAuthResponse> {
  const response = await fetch(
    `${settings.baseURL}/api/v1/auth/login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error(`Erro HTTP: ${response.status}`);
  }

  return await response.json();
}

export async function register(data: IRegisterInput): Promise<IAuthResponse> {
  const response = await fetch(
    `${settings.baseURL}/api/v1/auth/register`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error(`Erro HTTP: ${response.status}`);
  }

  return await response.json();
}
