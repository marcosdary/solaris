import { useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { KeyRound } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { phoneMask } from "../utils/phoneMask";

export default function PasswordForgotPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const { loading, error, forgotPassword, resetPassword, clearError } = useAuth();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function handleForgotSubmit(e: React.FormEvent) {
    e.preventDefault();
    clearError();
    setSuccessMessage("");

    const result = await forgotPassword(phone.replace(/\D/g, ""));
    if (result) {
      setSuccessMessage("Link de redefinição enviado para o seu WhatsApp.");
    }
  }

  async function handleResetSubmit(e: React.FormEvent) {
    e.preventDefault();
    clearError();
    setSuccessMessage("");

    if (password !== confirmPassword) {
      return;
    }

    if (!token) {
      return;
    }

    const result = await resetPassword(token, password);
    if (result) {
      setSuccessMessage("Senha redefinida com sucesso.");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  }

  if (token) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-sm">
          <div className="mb-8 text-center">
            <Link to="/" className="inline-block text-sm font-medium text-slate-400 transition hover:text-slate-600">
              Solaris
            </Link>

            <div className="mt-6 flex justify-center">
              <KeyRound size={32} strokeWidth={1.5} className="text-slate-300" />
            </div>

            <h1 className="mt-5 text-2xl font-bold text-slate-900">
              Redefinir Senha
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Escolha uma nova senha para sua conta
            </p>
          </div>

          <form onSubmit={handleResetSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                {successMessage}
              </div>
            )}

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Nova Senha
              </label>
              <input
                type="password"
                required
                placeholder="Nova senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Confirmar Senha
              </label>
              <input
                type="password"
                required
                placeholder="Confirme sua nova senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-slate-900 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Redefinindo..." : "Redefinir Senha"}
            </button>

            <p className="text-center text-sm text-slate-500">
              <Link to="/login" className="font-medium text-slate-900 underline underline-offset-2 transition hover:text-slate-600">
                Voltar ao login
              </Link>
            </p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-sm">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-block text-sm font-medium text-slate-400 transition hover:text-slate-600">
            Solaris
          </Link>

          <div className="mt-6 flex justify-center">
            <KeyRound size={32} strokeWidth={1.5} className="text-slate-300" />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Esqueceu sua senha?
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Informe seu telefone para receber o link de redefinição
          </p>
        </div>

        <form onSubmit={handleForgotSubmit} className="space-y-5">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
              {successMessage}
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Telefone
            </label>
            <input
              type="tel"
              required
              placeholder="(99) 99 99999-9999"
              value={phone}
              onChange={(e) => setPhone(phoneMask(e.target.value))}
              className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-slate-900 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Enviando..." : "Enviar link de redefinição"}
          </button>

          <p className="text-center text-sm text-slate-500">
            <Link to="/login" className="font-medium text-slate-900 underline underline-offset-2 transition hover:text-slate-600">
              Voltar ao login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
