import { useNavigate, Link } from "react-router-dom";
import { LogIn } from "lucide-react";
import { useState } from "react";
import { GoogleLoginButton } from "../components/auth/GoogleAuth";
import { LoginForm } from "../components/auth/LoginForm";
import { useAuthContext } from "../hooks/useAuthContext";
import { Loading } from "../components/Loading";

export default function LoginPage() {
  const navigate = useNavigate();
  const { refresh } = useAuthContext();
  const redirect = sessionStorage.getItem("redirectAfterLogin");
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  function handleSuccess() {
    refresh();
    navigate(redirect ?? "/curriculums");
  }

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-12">
      <div className="relative w-full max-w-md rounded-lg border border-border-default bg-bg-surface p-10">
        {isGoogleLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-bg-surface/80 backdrop-blur-sm">
            <Loading fullScreen={false} />
          </div>
        )}

        <div className="mb-8 text-center">
          <Link to="/" className="inline-block text-sm font-medium text-text-muted transition hover:text-text-primary">
            Solaris
          </Link>

          <div className="mt-6 flex justify-center">
            <LogIn size={32} strokeWidth={1.5} className="text-text-secondary" />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-text-primary">
            Entrar
          </h1>

          <p className="mt-2 text-[15px] text-text-secondary">
            Acesse sua conta para continuar
          </p>
        </div>

        {googleError && (
          <div className="mb-5 rounded-md border border-red-200 bg-red-50 p-3 text-[15px] text-red-700">
            {googleError}
          </div>
        )}
        <GoogleLoginButton
          setError={setGoogleError}
          onSuccess={handleSuccess}
          onLoadingChange={setIsGoogleLoading}
        />
        

        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 border-t border-border-default" />
          <span className="text-[13px] text-text-muted">ou</span>
          <div className="flex-1 border-t border-border-default" />
        </div>

        <LoginForm onSuccess={handleSuccess} disabled={isGoogleLoading} />

      </div>
    </div>
  );
}
