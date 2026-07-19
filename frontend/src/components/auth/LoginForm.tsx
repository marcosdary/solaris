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

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    clearError();

    const result = await login({ phone: phone.replace(/\D/g, "") });
    if (result) {
      onSuccess();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
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
        {loading ? "Entrando..." : "Entrar"}
      </button>

      <p className="text-center text-sm text-slate-500">
        Não tem conta?{" "}
        <Link to="/register" className="font-medium text-slate-900 underline underline-offset-2 transition hover:text-slate-600">
          Cadastre-se
        </Link>
      </p>
    </form>
  );
}
