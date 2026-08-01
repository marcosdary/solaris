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

  async function handleForgotSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    clearError();
    setSuccessMessage("");

    const result = await forgotPassword(phone.replace(/\D/g, ""));
    if (result) {
      setSuccessMessage("Link de redefinição enviado para o seu WhatsApp.");
    }
  }

  async function handleResetSubmit(e: React.SubmitEvent<HTMLFormElement>) {
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
        <div className="w-full max-w-md rounded-lg border border-border-default bg-bg-base p-10">

          <div className="mb-8 text-center">
            <Link to="/" className="inline-block text-sm font-medium text-text-muted transition hover:text-text-primary">
              Solaris
            </Link>

            <div className="mt-6 flex justify-center">
              <KeyRound size={32} strokeWidth={1.5} className="text-text-secondary" />
            </div>

            <h1 className="mt-5 text-2xl font-bold text-text-primary">
              Redefinir Senha
            </h1>

            <p className="mt-2 text-[15px] text-text-secondary">
              Escolha uma nova senha para sua conta
            </p>
          </div>

          <form onSubmit={handleResetSubmit} className="space-y-5">
            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-[15px] text-red-700">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="rounded-md border border-green-200 bg-green-50 p-3 text-[15px] text-green-700">
                {successMessage}
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-medium tracking-wide uppercase text-text-secondary">
                Nova Senha
              </label>
              <input
                type="password"
                required
                placeholder="Nova senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-border-default bg-transparent p-3 text-[15px] text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium tracking-wide uppercase text-text-secondary">
                Confirmar Senha
              </label>
              <input
                type="password"
                required
                placeholder="Confirme sua nova senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-md border border-border-default bg-transparent p-3 text-[15px] text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg px-7 py-3 text-[15px] font-medium text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              style={{
                background: "linear-gradient(135deg, #FFB200 0%, #FF8A00 100%)",
              }}
            >
              {loading ? "Redefinindo..." : "Redefinir Senha"}
            </button>

            <p className="text-center text-[15px] text-text-secondary">
              <Link to="/login" className="font-medium text-text-primary underline underline-offset-2 transition hover:text-accent-primary">
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
      <div className="w-full max-w-md rounded-lg border border-border-default bg-bg-base p-10">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-block text-sm font-medium text-text-muted transition hover:text-text-primary">
            Solaris
          </Link>

          <div className="mt-6 flex justify-center">
            <KeyRound size={32} strokeWidth={1.5} className="text-text-secondary" />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-text-primary">
            Esqueceu sua senha?
          </h1>

          <p className="mt-2 text-[15px] text-text-secondary">
            Informe seu telefone para receber o link de redefinição
          </p>
        </div>

        <form onSubmit={handleForgotSubmit} className="space-y-5">
          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-[15px] text-red-700">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="rounded-md border border-green-200 bg-green-50 p-3 text-[15px] text-green-700">
              {successMessage}
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-medium tracking-wide uppercase text-text-secondary">
              Telefone
            </label>
            <input
              type="tel"
              required
              placeholder="(99) 99 99999-9999"
              value={phone}
              onChange={(e) => setPhone(phoneMask(e.target.value))}
              className="w-full rounded-md border border-border-default bg-transparent p-3 text-[15px] text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg px-7 py-3 text-[15px] font-medium text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              background: "linear-gradient(135deg, #FFB200 0%, #FF8A00 100%)",
            }}
          >
            {loading ? "Enviando..." : "Enviar link de redefinição"}
          </button>

          <p className="text-center text-[15px] text-text-secondary">
            <Link to="/login" className="font-medium text-text-primary underline underline-offset-2 transition hover:text-accent-primary">
              Voltar ao login
            </Link>
          </p>
        </form>

      </div>
    </div>
  );
}
