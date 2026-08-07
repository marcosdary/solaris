import { useEffect, useState, lazy } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, FileX, Plus, User, LogOut } from "lucide-react";

const CurriculumCard = lazy( () => 
  import("../components/pageCurriculum/CurriculumCard").then((module) => ({ default: module.CurriculumCard }))
);
import { CurriculumSearchForm } from "../components/pageCurriculum/CurriculumSearchForm";
import { useAccessToken } from "../hooks/useAccessToken";

import { searchCurriculums } from "../services/curriculum";

import type { ICurriculumResponse } from "../types/curriculumResponse";
import type { SearchCurriculums } from "../types/curriculumCreate";

import { useAuthContext } from "../hooks/useAuthContext";

import { AuthenticationError } from "../errors";

export default function CurriculumsPage() {
  const { logout } = useAuthContext();
  const [curriculums, setCurriculums] = useState<ICurriculumResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastQuery, setLastQuery] = useState<SearchCurriculums | null>(null);
  const accessToken = useAccessToken();
  const location = useLocation();

  async function handleSearch(payload: SearchCurriculums) {
    try {
      setLoading(true);
      setLastQuery(payload);
      const result = await searchCurriculums(payload, accessToken ?? undefined);

      setCurriculums(result);
    } catch (error) {
      if ( error instanceof AuthenticationError ) {
        sessionStorage.setItem("redirectAfterLogin", location.pathname);
        logout();
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    searchCurriculums(undefined, accessToken ?? undefined)
      .then(setCurriculums)
      .catch((err) => {
        if (err instanceof AuthenticationError) {
          sessionStorage.setItem("redirectAfterLogin", location.pathname);
          logout();
          return;
        }
        setLoading(false);
      })
      .finally(() => setLoading(false));
  }, [accessToken, logout, location.pathname]);

  const hasCurriculums = curriculums.length > 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <nav className="mb-16 flex items-center justify-between sm:mb-32">
        <Link to="/" className="font-['Caveat'] text-3xl font-bold text-accent-sun">
          Solaris
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link
            to="/curriculums/form"
            className="rounded-lg border border-border-default px-3 py-1.5 text-[15px] font-medium text-accent-horizon transition hover:bg-bg-surface sm:px-4 sm:py-2"
          >
            Novo Currículo
          </Link>

          <Link
            to="/auth/me"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border-default px-3 py-1.5 text-[15px] font-medium text-accent-horizon transition hover:bg-bg-surface sm:px-4 sm:py-2"
          >
            <User size={18} strokeWidth={1.5} />
            <span className="hidden sm:inline">Meu Perfil</span>
          </Link>

          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border-default px-3 py-1.5 text-[15px] font-medium text-red-600 transition hover:bg-red-50 sm:px-4 sm:py-2"
          >
            <LogOut size={18} strokeWidth={1.5} />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </nav>

      <section className="mb-24">
        <h2 className="text-xl font-bold text-text-primary sm:text-2xl">
          Meus Currículos
        </h2>
      </section>

      <section className="mb-16" aria-label="Busca de currículos">
        <CurriculumSearchForm onSearch={handleSearch} />
      </section>

      {loading && (
        <section className="grid gap-6 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl border border-border-default bg-white p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-bg-surface" />
                  <div className="h-3.5 w-1/2 rounded bg-bg-surface" />
                </div>
                <div className="h-5 w-16 rounded-full bg-bg-surface" />
              </div>

              <div className="mt-3 h-3.5 w-2/3 rounded bg-bg-surface" />

              <div className="mt-2 h-3.5 w-1/3 rounded bg-bg-surface" />

              <div className="mt-4 flex gap-3">
                <div className="h-3.5 w-40 rounded bg-bg-surface" />
                <div className="h-3.5 w-16 rounded bg-bg-surface" />
              </div>
            </div>
          ))}
        </section>
      )}

      {!loading && !hasCurriculums && lastQuery === null && (
        <section className="py-8 text-center sm:py-12">
          <Search size={48} className="mx-auto text-text-muted" strokeWidth={1.5} />

          <h2 className="mt-5 text-[15px] font-semibold text-text-primary">
            Nenhum currículo encontrado
          </h2>

          <p className="mt-2 text-[15px] leading-relaxed text-text-secondary">
            Use os filtros acima para buscar currículos por categoria e idioma.
          </p>

          <div className="mt-6">
            <Link
              to="/curriculums/form"
              className="inline-flex items-center gap-1.5 rounded-lg px-7 py-3 text-[15px] font-medium text-white transition hover:brightness-110"
              style={{
                background: "linear-gradient(135deg, #FFB200 0%, #FF8A00 100%)",
              }}
            >
              <Plus size={16} strokeWidth={1.5} />
              Criar currículo
            </Link>
          </div>
        </section>
      )}

      {!loading && !hasCurriculums && lastQuery !== null && (
        <section className="py-8 text-center sm:py-12">
          <FileX size={48} className="mx-auto text-text-muted" strokeWidth={1.5} />

          <h2 className="mt-5 text-[15px] font-semibold text-text-primary">
            Nenhum currículo encontrado
          </h2>

          <p className="mt-2 text-[15px] leading-relaxed text-text-secondary">
            Não há resultados para os filtros selecionados.
          </p>

          <div className="mt-6 inline-flex flex-wrap justify-center gap-2">
            {lastQuery.category && (
              <span className="rounded-full bg-bg-surface px-3 py-1 text-[15px] text-text-secondary">
                {lastQuery.category}
              </span>
            )}
            {lastQuery.language && (
              <span className="rounded-full bg-bg-surface px-3 py-1 text-[15px] text-text-secondary">
                {lastQuery.language}
              </span>
            )}
          </div>

          <p className="mt-6 text-[15px] text-text-secondary">
            Tente alterar os filtros de categoria ou idioma.
          </p>
        </section>
      )}

      {!loading && hasCurriculums && (
        <section className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xs font-medium tracking-wide uppercase text-text-secondary">
            Resultados
          </h2>

          <span className="self-start rounded-full bg-bg-surface px-4 py-2 text-sm font-medium text-text-secondary sm:self-auto">
            {curriculums.length} currículo(s)
          </span>
        </section>
      )}

      {!loading && hasCurriculums && (
        <section className="grid gap-6 sm:grid-cols-2">
          {curriculums.map((curriculum) => (
            <CurriculumCard key={curriculum.id} curriculum={curriculum} />
          ))}
        </section>
      )}
    </div>
  );
}
