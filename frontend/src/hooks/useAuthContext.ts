import { useContext, createContext } from "react";

export interface AuthContextValue {
  isAuthenticated: boolean;
  logout(): void;
  refresh(): void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuthContext() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuthContext deve ser usado dentro de AuthProvider");
  }

  return ctx;
}