import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { phoneMask } from "../../utils/phoneMask";


interface LoginFormProps {
  onSuccess(): void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { loading, error, login, clearError } = useAuth();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    clearError();

    const result = await login({ phone: phone.replace(/\D/g, ""), password });
    if (result) {
      onSuccess();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-[15px] text-red-700">
          {error}
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

      <div>
        <label className="mb-1.5 block text-xs font-medium tracking-wide uppercase text-text-secondary">
          Senha
        </label>
        <input
          type="password"
          required
          placeholder="Sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md border border-border-default bg-transparent p-3 text-[15px] text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none"
        />
      </div>

      <div className="text-right">
        <Link to="/password-forgot" className="text-[15px] font-medium text-text-secondary underline underline-offset-2 transition hover:text-text-primary">
          Esqueceu sua senha?
        </Link>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-[6px] bg-accent-primary py-3 text-[15px] font-medium text-accent-text transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Entrando..." : "Entrar"}
      </button>

      <p className="text-center text-[15px] text-text-secondary">
        Não tem conta?{" "}
        <Link to="/register" className="font-medium text-text-primary underline underline-offset-2 transition hover:text-accent-primary">
          Cadastre-se
        </Link>
      </p>
    </form>
  );
}
