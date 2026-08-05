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
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    clearError();

    const result = await register({
      name: name.trim(),
      email: email.trim(),
      phone: phone.replace(/\D/g, ""),
      password: password,
    });

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
          Nome
        </label>
        <input
          type="text"
          required
          placeholder="Seu nome completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-md border border-border-default bg-transparent p-3 text-[15px] text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium tracking-wide uppercase text-text-secondary">
          Email
        </label>
        <input
          type="email"
          required
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-border-default bg-transparent p-3 text-[15px] text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none"
        />
      </div>

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

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-[6px] bg-accent-primary py-3 text-[15px] font-medium text-accent-text transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Criando conta..." : "Criar conta"}
      </button>

      <p className="text-center text-[15px] text-text-secondary">
        Já tem conta?{" "}
        <Link to="/login" className="font-medium text-text-primary underline underline-offset-2 transition hover:text-accent-primary">
          Faça login
        </Link>
      </p>
    </form>
  );
}
