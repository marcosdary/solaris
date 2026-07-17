import { Link } from "react-router-dom";

import { ServerStatus } from "../components/ServerStatus";

export default function CurriculumFormPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* NAVBAR */}
        <nav className="mb-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-800">
              Auto CV
            </h1>

            <ServerStatus />
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100"
            >
              Entrar
            </Link>

            <Link
              to="/curriculums"
              className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100"
            >
              Meus Currículos
            </Link>
          </div>
        </nav>

        {/* HERO */}
        <section className="grid gap-14 lg:grid-cols-2 lg:items-center">

          {/* Texto */}
          <div>
            <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
              🚀 Currículos com IA
            </span>

            <h2 className="mt-6 text-5xl font-bold leading-tight tracking-tight text-slate-900">
              Crie um currículo profissional em poucos minutos.
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-600">
              Gere currículos modernos para diversas áreas profissionais,
              personalize experiências, projetos, certificações e exporte tudo
              automaticamente utilizando inteligência artificial.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <p className="text-sm font-semibold text-slate-700">
                  📄 PDF
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <p className="text-sm font-semibold text-slate-700">
                  🤖 IA
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <p className="text-sm font-semibold text-slate-700">
                  🌎 Multilíngue
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                <p className="text-sm font-semibold text-slate-700">
                  ⚡ Rápido
                </p>
              </div>
            </div>
          </div>

        </section>

        {/* FEATURES */}
        <section className="mt-20 grid gap-6 md:grid-cols-3">

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800">
              🎯 Diversas áreas
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Tecnologia, Engenharia, Administração, Marketing, Saúde,
              Comercial e dezenas de outras categorias.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800">
              🌍 Idiomas
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Gere currículos em Português, Inglês ou Espanhol com apenas um
              clique.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-800">
              🚀 Exportação
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Exporte seus currículos prontos para impressão e compartilhamento.
            </p>
          </div>

        </section>

      </div>
    </div>
  );
}