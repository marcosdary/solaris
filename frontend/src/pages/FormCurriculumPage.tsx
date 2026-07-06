import { Link } from "react-router-dom";

import { CurriculumForm } from "../components/CurriculumForm";
import { ServerStatus } from "../components/ServerStatus";

export default function CurriculumFormPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-6 py-10">

        {/* HEADER */}
        <header className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-4xl font-bold tracking-tight text-slate-800">
                Novo Currículo
              </h1>

              <ServerStatus />
            </div>

            <p className="mt-2 text-slate-600">
              Preencha suas informações para gerar um currículo profissional.
            </p>
          </div>

          <Link
            to="/curriculums"
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 font-medium text-slate-700 shadow-sm transition hover:bg-slate-100"
          >
            ← Ver currículos
          </Link>
        </header>

        {/* FORMULÁRIO */}
        <section
          aria-label="Formulário de currículo"
          className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
        >
          <CurriculumForm />
        </section>
      </div>
    </div>
  );
}