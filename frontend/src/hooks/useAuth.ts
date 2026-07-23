import { useState } from "react";
import { login as apiLogin, register as apiRegister, forgotPassword as apiForgotPassword, resetPassword as apiResetPassword } from "../services/auth";
import { setToken } from "../utils/tokenStorage";
import { NotFoundError, ConflictError } from "../errors";
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
        err instanceof NotFoundError && err.detail ? err.detail[0].msg : "Erro ao fazer login.";
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
        err instanceof ConflictError && err.detail ? err.detail[0].msg : "Erro ao cadastrar.";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword(phone: string) {
    setLoading(true);
    setError(null);

    try {
      const response = await apiForgotPassword({ phone });
      return response;
    } catch (err) {
      const message =
        err instanceof NotFoundError && err.detail ? err.detail[0].msg : "Erro ao solicitar redefinição.";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(token: string, password: string) {
    setLoading(true);
    setError(null);

    try {
      const response = await apiResetPassword({ token, password });
      return response;
    } catch (err) {
      const message =
        err instanceof NotFoundError && err.detail ? err.detail[0].msg : "Erro ao redefinir senha.";
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
    forgotPassword: handleForgotPassword,
    resetPassword: handleResetPassword,
    clearError,
  };
}
