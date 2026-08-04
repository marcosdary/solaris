import { useEffect, useState, lazy } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  User,
  Phone,
  CheckCircle2,
  XCircle,
  Calendar,
  Clock9,
  Pencil,
} from "lucide-react";

import { useAccessToken } from "../hooks/useAccessToken";
import { useAuthContext } from "../hooks/useAuthContext";
import { getMe } from "../services/auth";

const UpdateUserModal = lazy(() => 
  import("../components/UpdateUserModal").then((module) => ({ default: module.UpdateUserModal }))
);

import type { IUserInfoResponse } from "../types/user";

import { AuthenticationError } from "../errors";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MePage() {
  const token = useAccessToken();
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthContext();

  const [user, setUser] = useState<IUserInfoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMe(token ?? undefined)
      .then(setUser)
      .catch((err) => {
        if (err instanceof AuthenticationError) {
          sessionStorage.setItem("redirectAfterLogin", location.pathname);
          logout();
          return;
        }
        setError("Não foi possível carregar as informações do usuário.");
      })
      .finally(() => setLoading(false));
  }, [token, logout, location.pathname]);
  
  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-12">
        <nav className="mb-16 flex items-center justify-between sm:mb-32">
          <Link
            to="/"
            className="font-['Caveat'] text-3xl font-bold text-accent-sun"
          >
            Solaris
          </Link>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-[15px] text-text-secondary transition hover:text-text-primary"
          >
            ← <span className="hidden sm:inline">Voltar</span>
          </button>
        </nav>

        <div className="rounded-2xl border border-border-default bg-white p-5 sm:p-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex flex-col gap-1 py-5 sm:flex-row sm:items-center sm:gap-4"
            >
              <div className="h-5 w-5 rounded bg-bg-surface" />
              <div className="h-4 w-20 rounded bg-bg-surface sm:hidden" />
              <div className="h-4 w-48 rounded bg-bg-surface" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-12">
        <nav className="mb-16 flex items-center justify-between sm:mb-32">
          <Link
            to="/"
            className="font-['Caveat'] text-3xl font-bold text-accent-sun"
          >
            Solaris
          </Link>
        </nav>

        <div className="mx-auto w-full max-w-md rounded-2xl border border-border-default bg-white p-5 text-center sm:p-10">
          <div className="mb-4 text-4xl sm:mb-6 sm:text-6xl">⚠️</div>

          <h1 className="text-xl font-bold text-text-primary sm:text-2xl">
            Erro ao carregar
          </h1>

          <p className="mt-3 text-[15px] text-text-secondary">
            {error}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/"
              className="rounded-lg px-7 py-3 text-[15px] font-medium text-white transition hover:brightness-110"
              style={{
                background:
                  "linear-gradient(135deg, #FFB200 0%, #FF8A00 100%)",
              }}
            >
              Ir para Home
            </Link>

            <Link
              to="/curriculums"
              className="rounded-lg border border-border-default bg-white px-5 py-3 text-[15px] font-medium text-accent-horizon transition hover:bg-bg-surface"
            >
              Meus Currículos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  function handleUserUpdated(updated: IUserInfoResponse) {
    setUser(updated);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-12">
      <nav className="mb-16 flex items-center justify-between sm:mb-32">
        <Link
          to="/"
          className="font-['Caveat'] text-3xl font-bold text-accent-sun"
        >
          Solaris
        </Link>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-[15px] text-text-secondary transition hover:text-text-primary"
        >
          ← <span className="hidden sm:inline">Voltar</span>
        </button>
      </nav>

      <section>
        <h2 className="mb-8 text-xl font-bold text-text-primary sm:text-2xl">
          Meu Perfil
        </h2>

        <div className="rounded-2xl border border-border-default bg-white p-5 sm:p-8">
          <div className="divide-y divide-border-default">
            <div className="flex flex-col gap-1 py-5 sm:flex-row sm:items-center sm:gap-4">
              <div className="flex flex-1 flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-4">
                <div className="flex items-center gap-2 sm:w-24 sm:shrink-0">
                  <User
                    size={20}
                    strokeWidth={1.5}
                    className="text-accent-horizon"
                  />
                  <span className="text-xs font-medium uppercase tracking-wide text-text-muted sm:hidden">
                    Nome
                  </span>
                </div>

                <span className="hidden text-xs font-medium uppercase tracking-wide text-text-muted sm:inline">
                  Nome
                </span>

                <span className="text-[15px] font-medium text-text-primary">
                  {user.name}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="mt-1 inline-flex items-center gap-1.5 self-start rounded-lg border border-border-default px-4 py-2 text-[15px] font-medium text-accent-horizon transition hover:bg-bg-surface sm:mt-0 sm:self-auto"
              >
                <Pencil size={16} strokeWidth={1.5} />
                <span className="hidden sm:inline">Editar nome</span>
              </button>
            </div>

            <div className="flex flex-col gap-1 py-5 sm:flex-row sm:items-center sm:gap-4">
              <div className="flex flex-1 flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-4">
                <div className="flex items-center gap-2 sm:w-24 sm:shrink-0">
                  <Phone
                    size={20}
                    strokeWidth={1.5}
                    className="text-accent-horizon"
                  />
                  <span className="text-xs font-medium uppercase tracking-wide text-text-muted sm:hidden">
                    Telefone
                  </span>
                </div>

                <span className="hidden text-xs font-medium uppercase tracking-wide text-text-muted sm:inline">
                  Telefone
                </span>

                <span className="text-[15px] font-medium text-text-primary">
                  {user.phone}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="mt-1 inline-flex items-center gap-1.5 self-start rounded-lg border border-border-default px-4 py-2 text-[15px] font-medium text-accent-horizon transition hover:bg-bg-surface sm:mt-0 sm:self-auto"
              >
                <Pencil size={16} strokeWidth={1.5} />
                <span className="hidden sm:inline">Editar telefone</span>
              </button>
            </div>

            <div className="flex flex-col gap-1 py-5 sm:flex-row sm:items-center sm:gap-4">
              <div className="flex items-center gap-2 sm:w-24 sm:shrink-0">
                {user.is_active ? (
                  <CheckCircle2
                    size={20}
                    strokeWidth={1.5}
                    className="text-green-600"
                  />
                ) : (
                  <XCircle
                    size={20}
                    strokeWidth={1.5}
                    className="text-red-500"
                  />
                )}
                <span className="text-xs font-medium uppercase tracking-wide text-text-muted sm:hidden">
                  Status
                </span>
              </div>

              <span className="hidden text-xs font-medium uppercase tracking-wide text-text-muted sm:inline">
                Status
              </span>

              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-[15px] font-medium ${
                  user.is_active
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {user.is_active ? "Ativo" : "Inativo"}
              </span>
            </div>

            <div className="flex flex-col gap-1 py-5 sm:flex-row sm:items-center sm:gap-4">
              <div className="flex items-center gap-2 sm:w-24 sm:shrink-0">
                <Calendar
                  size={20}
                  strokeWidth={1.5}
                  className="text-accent-horizon"
                />
                <span className="text-xs font-medium uppercase tracking-wide text-text-muted sm:hidden">
                  Criado em
                </span>
              </div>

              <span className="hidden text-xs font-medium uppercase tracking-wide text-text-muted sm:inline">
                Criado em
              </span>

              <span className="text-[15px] text-text-primary">
                {formatDate(user.created_at)}
              </span>
            </div>

            <div className="flex flex-col gap-1 py-5 sm:flex-row sm:items-center sm:gap-4">
              <div className="flex items-center gap-2 sm:w-24 sm:shrink-0">
                <Clock9
                  size={20}
                  strokeWidth={1.5}
                  className="text-accent-horizon"
                />
                <span className="text-xs font-medium uppercase tracking-wide text-text-muted sm:hidden">
                  Atualizado
                </span>
              </div>

              <span className="hidden text-xs font-medium uppercase tracking-wide text-text-muted sm:inline">
                Atualizado
              </span>

              <span className="text-[15px] text-text-primary">
                {formatDateTime(user.updated_at)}
              </span>
            </div>
          </div>
        </div>
      </section>

      <UpdateUserModal
        open={modalOpen}
        currentName={user.name}
        currentPhone={user.phone}
        onClose={() => setModalOpen(false)}
        onSuccess={handleUserUpdated}
      />
    </div>
  );
}
