import { useNavigate, Link } from "react-router-dom";

import { CurriculumForm } from "../components/CurriculumForm";
import type { ICurriculumResponse } from "../types/curriculumResponse";

export default function CurriculumFormPage() {
  const navigate = useNavigate();

  function handleSuccess(result: ICurriculumResponse) {
    navigate(`/curriculums/${result.id}`);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-6 py-10">

        <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-800">
              Novo Currículo
            </h1>

            <p className="mt-2 text-slate-600">
              Preencha suas informações para gerar um currículo profissional.
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
              to="/curriculums"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 font-medium text-slate-700 shadow-sm transition hover:bg-slate-100"
            >
              ← Ver currículos
            </Link>
          </div>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <CurriculumForm mode="create" onSuccess={handleSuccess} />
        </section>

      </div>
    </div>
  );
}