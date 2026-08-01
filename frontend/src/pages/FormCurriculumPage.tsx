import { useNavigate } from "react-router-dom";

import { CurriculumForm } from "../components/CurriculumForm";
import type { ICurriculumResponse } from "../types/curriculumResponse";

export default function CurriculumFormPage() {
  const navigate = useNavigate();

  function handleSuccess(result: ICurriculumResponse) {
    navigate(`/curriculums/${result.id}`);
  }

  return (
    <div className="min-h-screen bg-bg-base">
      <div className="w-full px-4 py-6 sm:px-8 md:px-12 sm:py-12">

        <header className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">
              Novo Currículo
            </h1>

            <p className="mt-1.5 text-[15px] text-text-secondary">
              Preencha suas informações para gerar um currículo profissional.
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

        <CurriculumForm mode="create" onSuccess={handleSuccess} />

      </div>
    </div>
  );
}
