import { useState } from "react";
import { Link } from "react-router-dom";

import { JobCard } from "../components/JobCard";
import { ServerStatus } from "../components/ServerStatus";
import { JobSearchForm } from "../components/JobSearchForm";
import { searchJobs } from "../services/api";

import type { Job, JobSearchRequest } from "../types/jobs";

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastQuery, setLastQuery] = useState<JobSearchRequest | null>(null);

  async function handleSearch(payload: JobSearchRequest) {
    try {
      setLoading(true);
      setLastQuery(payload);

      const result = await searchJobs(payload);
      setJobs(result);
    } catch (error) {
      console.error(error);
      alert(`Erro: ${error}`);
    } finally {
      setLoading(false);
    }
  }

  const hasJobs = jobs.length > 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* HEADER */}
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {/* Alinha o título e o ServerStatus na mesma linha */}
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-4xl font-bold text-slate-800 tracking-tight">
                Auto CV
              </h1>
              <div className="mt-1">
                <ServerStatus />
              </div>
            </div>

            <p className="mt-2 text-slate-600">
              Pesquise vagas em LinkedIn, Indeed e outras plataformas.
            </p>
          </div>

          <Link
            to="/autocv"
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 font-medium text-white shadow-sm transition hover:bg-blue-700"
          >
            Gerar Currículo
          </Link>
        </header>

        {/* SEARCH SECTION */}
        <section aria-label="Busca de vagas" className="mb-8">
          <JobSearchForm onSearch={handleSearch} />
        </section>

        {/* LOADING */}
        {loading && (
          <section
            aria-label="Carregando resultados"
            className="rounded-2xl border border-blue-100 bg-blue-50 p-6 text-center"
          >
            <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="text-slate-700">Buscando vagas...</p>

            {lastQuery && (
              <p className="mt-2 text-xs text-slate-500">
                Buscando: {lastQuery.search} em {lastQuery.location}
              </p>
            )}
          </section>
        )}

        {/* EMPTY STATE */}
        {!loading && !hasJobs && (
          <section
            aria-label="Nenhum resultado"
            className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm"
          >
            <h2 className="text-lg font-semibold text-slate-700">
              Nenhuma vaga encontrada
            </h2>

            <p className="mt-2 text-slate-500">
              Ajuste os filtros de busca para encontrar mais resultados.
            </p>
          </section>
        )}

        {/* RESULTS HEADER */}
        {!loading && hasJobs && (
          <section
            aria-label="Resultados da busca"
            className="mb-6 flex items-center justify-between"
          >
            <h2 className="text-xl font-semibold text-slate-800">
              Resultados
            </h2>

            <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
              {jobs.length} vagas encontradas
            </span>
          </section>
        )}

        {/* JOB GRID */}
        {!loading && hasJobs && (
          <section aria-label="Lista de vagas">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}