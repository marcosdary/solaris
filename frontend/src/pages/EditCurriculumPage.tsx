import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

import { CurriculumForm } from "../components/CurriculumForm";
import { selectCurriculumByID } from "../services/curriculum";
import { useAccessToken } from "../hooks/useAccessToken";
import { useAuthContext } from "../hooks/useAuthContext";

import type { ICurriculumResponse } from "../types/curriculumResponse";

// errors
import { AuthenticationError } from "../errors";

export default function EditCurriculumPage() {
  const { id } = useParams<{ id: string }>();
  const accessToken = useAccessToken();
  const navigate = useNavigate();

  const { logout } = useAuthContext();

  const [curriculum, setCurriculum] =
    useState<ICurriculumResponse | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    selectCurriculumByID(id, accessToken ?? undefined)
      .then(setCurriculum)
      .catch((err) => {
        if (err instanceof AuthenticationError) {
        logout();
      }
      })
      .finally(() => setLoading(false));
  }, [id, accessToken, logout]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-accent-horizon/20 border-t-accent-horizon" />
            <span className="text-text-secondary">Carregando...</span>
        </div>
      </div>
      );
  }

  if (!curriculum) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-md rounded-2xl border border-border-default bg-white p-10 text-center">

          <div className="mb-6 text-6xl">📄</div>

          <h1 className="text-2xl font-bold text-text-primary">
            Currículo não encontrado
          </h1>

          <p className="mt-3 text-[15px] text-text-secondary">
            O currículo pode ter sido removido ou o link informado é inválido.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">

            <Link
              to="/"
              className="rounded-lg px-7 py-3 text-[15px] font-medium text-white transition hover:brightness-110"
              style={{
                background: "linear-gradient(135deg, #FFB200 0%, #FF8A00 100%)",
              }}
            >
              Ir para Home
            </Link>

            <Link
              to="/curriculums"
              className="rounded-lg border border-border-default bg-white px-5 py-3 text-[15px] font-medium text-accent-horizon transition hover:bg-bg-surface"
            >
              Ver Currículos
            </Link>

          </div>
        </div>
      </div>
    );
  }

  function handleSuccess() {
    navigate(`/curriculums/${id}`);
  }

  return (
    <div className="min-h-screen bg-bg-base">
      <div className="w-full px-4 py-6 sm:px-8 md:px-12 sm:py-12">

        <header className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
              Editar Currículo
            </h1>

            <p className="mt-1.5 text-[15px] text-text-secondary">
              Atualize as informações do currículo.
            </p>
          </div>

          <div className="flex items-center gap-4 text-[15px] text-text-secondary">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="transition hover:text-text-primary"
            >
              ← Voltar
            </button>

          </div>
        </header>

        <CurriculumForm
          mode="edit"
          initialData={curriculum}
          onSuccess={handleSuccess}
        />

      </div>
    </div>
  );
}
