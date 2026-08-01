import { useNavigate, Link } from "react-router-dom";
import { UserPlus } from "lucide-react";
import { RegisterForm } from "../components/auth/RegisterForm";
import { useAuthContext } from "../hooks/useAuthContext";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { refresh } = useAuthContext();

  function handleSuccess() {
    refresh();
    navigate("/curriculums");
  }

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-lg border border-border-default bg-bg-surface p-10">

        <div className="mb-8 text-center">
          <Link to="/" className="inline-block text-sm font-medium text-text-muted transition hover:text-text-primary">
            Solaris
          </Link>

          <div className="mt-6 flex justify-center">
            <UserPlus size={32} strokeWidth={1.5} className="text-text-secondary" />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-text-primary">
            Criar Conta
          </h1>

          <p className="mt-2 text-[15px] text-text-secondary">
            Cadastre-se para criar seus currículos
          </p>
        </div>

        <RegisterForm onSuccess={handleSuccess} />

      </div>
    </div>
  );
}
