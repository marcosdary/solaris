import type { Job } from "../types/jobs";

interface Props {
  job: Job;
}

export function JobCard({ job }: Props) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">

      {/* Cabeçalho */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">
            {job.title}
          </h2>

          <p className="mt-1 text-sm font-medium text-slate-600">
            {job.company}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            📍 {job.location}
          </p>
        </div>

        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
          {job.site}
        </span>
      </div>

      {/* Descrição */}
      <div className="mt-5">
        <p className="line-clamp-5 text-sm leading-6 text-slate-600">
          {job.description}
        </p>
      </div>

      {/* Rodapé */}
      <div className="mt-6 flex items-center gap-3">

        <a
          href={job.job_url}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          Ver vaga
        </a>

        <a
          href={job.company_url}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          Empresa
        </a>
      </div>
    </article>
  );
}