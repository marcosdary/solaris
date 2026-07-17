import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { phoneMask } from "../../utils/phoneMask";

interface RegisterFormProps {
  onSuccess(): void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { loading, error, register, clearError } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    clearError();

    const result = await register({
      name: name.trim(),
      phone: phone.replace(/\D/g, ""),
    });

    if (result) {
      onSuccess();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Nome
        </label>
        <input
          type="text"
          required
          placeholder="Seu nome completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg border border-slate-300 p-2 focus:border-blue-500 focus:outline-none"
        />
      </div>

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
          className="w-full rounded-lg border border-slate-300 p-2 focus:border-blue-500 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Criando conta..." : "Criar conta"}
      </button>

      <p className="text-center text-sm text-slate-600">
        Já tem conta?{" "}
        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-800">
          Faça login
        </Link>
      </p>
    </form>
  );
}
