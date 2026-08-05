import { useState } from "react";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";

import { googleLogin } from "../../services/auth";
import { setToken } from "../../utils/tokenStorage";
import { ApiError } from "../../errors";
import { Loading } from "../Loading";

interface GoogleLoginButtonProps {
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  onSuccess: () => void;
  onLoadingChange?: (loading: boolean) => void;
}

export function GoogleLoginButton({
  setError,
  onSuccess,
  onLoadingChange,
}: GoogleLoginButtonProps) {
  const isMobile = window.innerWidth < 640;
  const [isLoading, setIsLoading] = useState(false);

  async function handleGoogleSuccess(response: CredentialResponse) {
    setError(null);
    setIsLoading(true);
    onLoadingChange?.(true);

    try {
      const result = await googleLogin({
        credential: response.credential!,
      });

      setToken(result.access_token);

      onSuccess();
    } catch (err) {
      const message =
        err instanceof ApiError && err.detail
          ? err.detail[0].msg
          : "Erro ao entrar com Google.";

      setError(message);
    } finally {
      setIsLoading(false);
      onLoadingChange?.(false);
    }
  }

  if (isLoading) {
    return <Loading fullScreen={false} size="sm" message="Conectando com Google..." />;
  }

  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => {
          setError("Erro ao conectar com o Google.");
        }}
        theme="outline"
        shape="rectangular"
        size="large"
        text="signin_with"
        width={isMobile ? 320 : 400}
      />
    </div>
  );
}
