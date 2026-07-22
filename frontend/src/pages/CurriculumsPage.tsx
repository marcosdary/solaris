import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, FileX, Plus } from "lucide-react";

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
      console.error(`Erro: ${error}`);
    } finally {
      setLoading(false);
    }
  }

  const hasCurriculums = curriculums.length > 0;

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <nav className="mb-24 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold tracking-tight text-slate-800">
          Solaris
        </Link>

        <div className="flex items-center gap-2">

          <Link
            to="/curriculums/form"
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-200/60 hover:text-slate-900"
          >
            Novo Currículo
          </Link>
        </div>
      </nav>

      <section className="mb-24">
        <h2 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-slate-900 md:text-5xl">
          Meus Currículos
        </h2>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-500">
          Consulte e gerencie seus currículos cadastrados por categoria e
          idioma.
        </p>
      </section>

      <section className="mb-16" aria-label="Busca de currículos">
        <CurriculumSearchForm onSearch={handleSearch} />
      </section>

      {loading && (
        <section className="rounded-xl p-6 text-center transition hover:bg-white">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="text-slate-700">Buscando currículos...</p>

          {lastQuery && (
            <p className="mt-2 text-xs text-slate-500">
              {lastQuery.category && <>Categoria: {lastQuery.category}</>}
              {lastQuery.category && lastQuery.language && " • "}
              {lastQuery.language && <>Idioma: {lastQuery.language}</>}
            </p>
          )}
        </section>
      )}

      {!loading && !hasCurriculums && lastQuery === null && (
        <section className="rounded-xl p-6 text-center transition hover:bg-white">
          <Search size={48} className="mx-auto text-slate-300" strokeWidth={1.5} />

          <h2 className="mt-5 text-sm font-semibold text-slate-800">
            Nenhum currículo encontrado
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-slate-500">
            Use os filtros acima para buscar currículos por categoria e idioma.
          </p>

          <div className="mt-6">
            <Link
              to="/curriculums/form"
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              <Plus size={16} strokeWidth={1.5} />
              Criar currículo
            </Link>
          </div>
        </section>
      )}

      {!loading && !hasCurriculums && lastQuery !== null && (
        <section className="rounded-xl p-6 text-center transition hover:bg-white">
          <FileX size={48} className="mx-auto text-slate-300" strokeWidth={1.5} />

          <h2 className="mt-5 text-sm font-semibold text-slate-800">
            Nenhum currículo encontrado
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-slate-500">
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

      {!loading && hasCurriculums && (
        <section className="mb-6 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-800">Resultados</h2>

          <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
            {curriculums.length} currículo(s)
          </span>
        </section>
      )}

      {!loading && hasCurriculums && (
        <section className="grid gap-1 sm:grid-cols-2">
          {curriculums.map((curriculum) => (
            <div key={curriculum.id} className="rounded-xl transition hover:bg-white">
              <CurriculumCard curriculum={curriculum} />
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
