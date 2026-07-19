import { useState } from "react";
import { Link } from "react-router-dom";

import { ServerStatus } from "../components/ServerStatus";
import { CurriculumCard } from "../components/page-curriculum/CurriculumCard";
import { CurriculumSearchForm } from "../components/page-curriculum/CurriculumSearchForm";
import { useAccessToken } from "../hooks/useAccessToken";

import { searchCurriculums } from "../services/curriculum";

import type { ICurriculumResponse } from "../types/curriculumResponse";
import type { SearchCurriculums } from "../types/curriculumCreate";

export default function CurriculumsPage() {
  const [curriculums, setCurriculums] = useState<ICurriculumResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastQuery, setLastQuery] = useState<SearchCurriculums | null>(null);
  const accessToken = useAccessToken();

  async function handleSearch(payload: SearchCurriculums) {
    try {
      setLoading(true);
      setLastQuery(payload);

      const result = await searchCurriculums(payload, accessToken ?? undefined);

      setCurriculums(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const hasCurriculums = curriculums.length > 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* HEADER */}
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/"
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100"
              >
                ← Home
              </Link>

              <h1 className="text-4xl font-bold tracking-tight text-slate-800">
                Currículos
              </h1>

              <div className="mt-1">
                <ServerStatus />
              </div>
            </div>

            <p className="mt-2 text-slate-600">
              Consulte currículos cadastrados por categoria e idioma.
            </p>
          </div>

          <Link
            to="/curriculums/form"
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-medium text-white shadow-sm transition hover:bg-blue-700"
          >
            Novo currículo
          </Link>
        </header>

        {/* SEARCH */}
        <section className="mb-8" aria-label="Busca de currículos">
          <CurriculumSearchForm onSearch={handleSearch} />
        </section>

        {/* LOADING */}
        {loading && (
          <section className="rounded-2xl border border-blue-100 bg-blue-50 p-6 text-center">
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="text-slate-700">
              Buscando currículos...
            </p>

            {lastQuery && (
              <p className="mt-2 text-xs text-slate-500">
                {lastQuery.category && (
                  <>Categoria: {lastQuery.category}</>
                )}

                {lastQuery.category && lastQuery.language && " • "}

                {lastQuery.language && (
                  <>Idioma: {lastQuery.language}</>
                )}
              </p>
            )}
          </section>
        )}

        {/* EMPTY */}
        {!loading && !hasCurriculums && lastQuery === null && (
          <section className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mb-6 text-6xl">🔍</div>

            <h2 className="text-2xl font-bold text-slate-900">
              Encontre currículos
            </h2>

            <p className="mt-3 text-slate-600">
              Use os filtros acima para buscar currículos por categoria e idioma.
            </p>

            <div className="mt-8">
              <Link
                to="/curriculums/form"
                className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
              >
                Novo currículo
              </Link>
            </div>
          </section>
        )}

        {!loading && !hasCurriculums && lastQuery !== null && (
          <section className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mb-6 text-6xl">📭</div>

            <h2 className="text-2xl font-bold text-slate-900">
              Nenhum currículo encontrado
            </h2>

            <p className="mt-3 text-slate-600">
              Não há resultados para os filtros selecionados.
            </p>

            <div className="mt-6 inline-flex flex-wrap justify-center gap-2 text-sm text-slate-500">
              {lastQuery.category && (
                <span className="rounded-full bg-slate-100 px-3 py-1">
                  {lastQuery.category}
                </span>
              )}
              {lastQuery.language && (
                <span className="rounded-full bg-slate-100 px-3 py-1">
                  {lastQuery.language}
                </span>
              )}
            </div>

            <p className="mt-6 text-sm text-slate-500">
              Tente alterar os filtros de categoria ou idioma.
            </p>
          </section>
        )}

        {/* RESULTS */}
        {!loading && hasCurriculums && (
          <section className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800">
              Resultados
            </h2>

            <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
              {curriculums.length} currículo(s)
            </span>
          </section>
        )}

        {/* GRID */}
        {!loading && hasCurriculums && (
          <section>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {curriculums.map((curriculum) => (
                <CurriculumCard
                  key={curriculum.id}
                  curriculum={curriculum}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}