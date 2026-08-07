import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { PersonalPhone } from "../PersonalPhone";

interface LoginFormProps {
  onSuccess(): void;
  disabled?: boolean;
}
interface LoginFormState {
  phone: string;
  ddi: string;
  password: string;
}

export function LoginForm({ onSuccess, disabled }: LoginFormProps) {
  const { loading, error, login, clearError } = useAuth();

  const [form, setForm] = useState<LoginFormState>({
    phone: "",
    ddi: "",
    password: "",
  });

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };
  
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    clearError();
    
    const result = await login({
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
          disabled={disabled}
          placeholder="Sua senha"
          value={form.password}
          onChange={(e) => updateField("password", e.target.value)}
          className="w-full rounded-md border border-border-default bg-transparent p-3 text-[15px] text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none"
        />
      </div>

      <div className="text-right">
        <Link to={disabled ? "#" : "/password-forgot"} className={`text-[15px] font-medium text-text-secondary underline underline-offset-2 transition hover:text-text-primary ${disabled ? "pointer-events-none opacity-50" : ""}`}>
          Esqueceu sua senha?
        </Link>
      </div>

      <button
        type="submit"
        disabled={loading || disabled}
        className="w-full rounded-[6px] bg-accent-primary py-3 text-[15px] font-medium text-accent-text transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Entrando..." : "Entrar"}
      </button>

      <p className="text-center text-[15px] text-text-secondary">
        Não tem conta?{" "}
        <Link to={disabled ? "#" : "/register"} className={`font-medium text-text-primary underline underline-offset-2 transition hover:text-accent-primary ${disabled ? "pointer-events-none opacity-50" : ""}`}>
          Cadastre-se
        </Link>
      </p>
    </form>
  );
}
