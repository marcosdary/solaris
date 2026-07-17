import { useState } from "react";
import { login as apiLogin, register as apiRegister } from "../services/api";
import { setToken } from "../utils/tokenStorage";
import type { ILoginInput, IRegisterInput, IAuthResponse } from "../types/auth";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IAuthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(data: ILoginInput) {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await apiLogin(data);
      setToken(response.access_token);
      setResult(response);
      return response;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao fazer login.";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(data: IRegisterInput) {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await apiRegister(data);
      setToken(response.access_token);
      setResult(response);
      return response;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao cadastrar.";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  function clearError() {
    setError(null);
  }

  return {
    loading,
    result,
    error,
    login: handleLogin,
    register: handleRegister,
    clearError,
  };
}
