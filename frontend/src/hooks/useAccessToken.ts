import { useSearchParams } from "react-router-dom";
import { getToken, setToken } from "../utils/tokenStorage";

export function useAccessToken(): string | undefined {
  const [searchParams] = useSearchParams();
  const urlToken = searchParams.get("access_token");

  if (urlToken) {
    setToken(urlToken);
    return urlToken;
  }

  return getToken() ?? undefined;
}
