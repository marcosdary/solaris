import { useNavigate } from "react-router-dom";
import {
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { getToken, removeToken } from "../utils/tokenStorage";
import { AuthContext } from "../hooks/useAuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(
    () => getToken() !== null
  );

  const refresh = useCallback(() => {
    setIsAuthenticated(getToken() !== null);
  }, []);

  const logout = useCallback(() => {
    removeToken();
    setIsAuthenticated(false);

    navigate("/login", { replace: true });
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}
