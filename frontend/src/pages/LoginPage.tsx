import { useNavigate } from "react-router-dom";
import { LoginForm } from "../components/auth/LoginForm";
import { useAuthContext } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { refresh } = useAuthContext();

  function handleSuccess() {
    refresh();
    navigate("/curriculums");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">

        <div className="mb-8 text-center">
          <div className="mb-4 text-5xl">📋</div>
          <h1 className="text-2xl font-bold text-slate-900">
            Entrar
          </h1>
          <p className="mt-2 text-slate-600">
            Acesse sua conta para continuar
          </p>
        </div>

        <LoginForm onSuccess={handleSuccess} />

      </div>
    </div>
  );
}
