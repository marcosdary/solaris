import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { PersonalPhone } from "../PersonalPhone";

interface RegisterFormProps {
  onSuccess(): void;
}

interface RegisterFormState {
  ddi: string;
  name: string;
  email: string;
  phone: string;
  password: string;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { loading, error, register, clearError } = useAuth();

  const [form, setForm] = useState<RegisterFormState>({
    ddi: "",
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };
  

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    clearError();

    const result = await register({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.replace(/\D/g, ""),
      password: form.password,
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
          value={form.name}
          onChange={(e) => updateField("name", e.target.value)}
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
          value={form.email}
          onChange={(e) => updateField("email", e.target.value)}
          className="w-full rounded-md border border-border-default bg-transparent p-3 text-[15px] text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium tracking-wide uppercase text-text-secondary">
          Telefone
        </label>
        <PersonalPhone
          form={form}
          updateField={updateField}
          inputStyle="w-full bg-transparent p-1 text-[15px] text-text-primary placeholder:text-text-muted focus:outline-none"
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
          value={form.password}
          onChange={(e) => updateField("password", e.target.value)}
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
