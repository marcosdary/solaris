import { useNavigate, Link } from "react-router-dom";
import { LogIn } from "lucide-react";
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
    <div className="flex flex-1 items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-sm">

        <div className="mb-8 text-center">
          <Link to="/" className="inline-block text-sm font-medium text-slate-400 transition hover:text-slate-600">
            Auto CV
          </Link>

          <div className="mt-6 flex justify-center">
            <LogIn size={32} strokeWidth={1.5} className="text-slate-300" />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Entrar
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Acesse sua conta para continuar
          </p>
        </div>

        <LoginForm onSuccess={handleSuccess} />

      </div>
    </div>
  );
}
