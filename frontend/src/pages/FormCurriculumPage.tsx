import { useNavigate, Link } from "react-router-dom";

import { CurriculumForm } from "../components/CurriculumForm";
import type { ICurriculumResponse } from "../types/curriculumResponse";

export default function CurriculumFormPage() {
  const navigate = useNavigate();

  function handleSuccess(result: ICurriculumResponse) {
    navigate(`/curriculums/${result.id}`);
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full px-4 py-6 sm:px-8 md:px-12 sm:py-12">

        <header className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-800 sm:text-3xl">
              Novo Currículo
            </h1>

            <p className="mt-1.5 text-sm text-slate-400">
              Preencha suas informações para gerar um currículo profissional.
            </p>
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-500">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="transition hover:text-slate-800"
            >
              ← Voltar
            </button>

            <Link to="/" className="transition hover:text-slate-800">
              Home
            </Link>
          </div>
        </header>

        <CurriculumForm mode="create" onSuccess={handleSuccess} />

      </div>
    </div>
  );
}