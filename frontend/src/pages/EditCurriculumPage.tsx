import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

import { CurriculumForm } from "../components/CurriculumForm";
import { selectCurriculumByID } from "../services/curriculum";
import { useAccessToken } from "../hooks/useAccessToken";

import type { ICurriculumResponse } from "../types/curriculumResponse";

export default function EditCurriculumPage() {
  const { id } = useParams<{ id: string }>();
  const accessToken = useAccessToken();
  const navigate = useNavigate();

  const [curriculum, setCurriculum] =
    useState<ICurriculumResponse | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    selectCurriculumByID(id, accessToken ?? undefined)
      .then(setCurriculum)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, accessToken]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Carregando...
      </div>
    );
  }

  if (!curriculum) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">

          <div className="mb-6 text-6xl">📄</div>

          <h1 className="text-2xl font-bold text-slate-900">
            Currículo não encontrado
          </h1>

          <p className="mt-3 text-slate-600">
            O currículo pode ter sido removido ou o link informado é inválido.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">

            <Link
              to="/"
              className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
            >
              Ir para Home
            </Link>

            <Link
              to="/curriculums"
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-100"
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
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-6 py-10">

        <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-800">
              Editar Currículo
            </h1>

            <p className="mt-2 text-slate-600">
              Atualize as informações do currículo.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-medium text-slate-500 transition hover:bg-slate-200/60 hover:text-slate-900"
            >
              ← Home
            </Link>

            <Link
              to={`/curriculums/${id}`}
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 font-medium text-slate-700 shadow-sm transition hover:bg-slate-100"
            >
              ← Voltar
            </Link>
          </div>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <CurriculumForm
            mode="edit"
            initialData={curriculum}
            onSuccess={handleSuccess}
          />
        </section>

      </div>
    </div>
  );
}
