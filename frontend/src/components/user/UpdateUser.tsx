import { useState, useEffect } from "react";
import { X } from "lucide-react";

import { useAccessToken } from "../../hooks/useAccessToken";
import { updateMe } from "../../services/user";

import { PersonalPhone } from "../PersonalPhone";

import type { IUserInfoResponse } from "../../types/user";
import { ApiError } from "../../errors";

interface UpdateUserModalProps {
  currentName: string;
  currentPhone: string | null;
  currentEmail: string | null;
  onClose: () => void;
  onSuccess: (updated: IUserInfoResponse) => void;
}

interface UpdateUserFormState {
  name: string;
  email: string;
  ddi: string;
  phone: string;
}

export function UpdateUserModal({
  currentName,
  currentPhone,
  currentEmail,
  onClose,
  onSuccess,
}: UpdateUserModalProps) {
  const token = useAccessToken();

  const [form, setForm] = useState<UpdateUserFormState>({
    ddi: "",
    name: currentName,
    phone: currentPhone?.slice(-11),
    email: currentEmail,
    
  });

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const updated = await updateMe(token ?? undefined, {
        name: form.name.trim(),
        phone: form.phone.replace(/\D/g, ""),
        email: form.email.trim() || undefined,
      });
      onSuccess(updated);
      onClose();
    } catch (err) {
      const message =
      err instanceof ApiError && err.detail ? err.detail[0].msg : "Erro ao atualizar perfil. Tente novamente.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 transition-opacity"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-2xl border border-border-default bg-white p-5 sm:p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary sm:text-[18px]">
            Editar Perfil
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-text-muted transition hover:text-text-primary"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

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
              autoFocus
              type="text"
              required
              placeholder="Seu nome"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
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
              Email
            </label>

            <input
              type="email"
              placeholder="seu@email.com"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              className="w-full rounded-md border border-border-default bg-transparent p-3 text-[15px] text-text-primary placeholder:text-text-muted focus:border-accent-primary focus:outline-none"
            />
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:gap-3">
            <button
              type="submit"
              disabled={loading || !form.name.trim()}
              className="rounded-lg px-7 py-3 text-[15px] font-medium text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 w-full sm:w-auto"
              style={{
                background:
                  "linear-gradient(135deg, #FFB200 0%, #FF8A00 100%)",
              }}
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border-default px-5 py-3 text-[15px] font-medium text-accent-horizon transition hover:bg-bg-surface w-full sm:w-auto"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
