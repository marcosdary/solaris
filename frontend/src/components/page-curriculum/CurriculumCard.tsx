import { Link } from "react-router-dom";
import { MapPin, Mail, Globe } from "lucide-react";
import type { ICurriculumResponse } from "../../types/curriculumResponse";

interface Props {
  curriculum: ICurriculumResponse;
}

function formatCategory(category: string) {
  return category
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatLanguage(language: string) {
  switch (language) {
    case "portuguese":
      return "Português";
    case "english":
      return "English";
    case "spanish":
      return "Español";
    default:
      return language;
  }
}

export function CurriculumCard({ curriculum }: Props) {
  return (
    <article className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">
            {curriculum.name}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {curriculum.role}
          </p>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {formatLanguage(curriculum.language)}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-sm text-slate-500">
        <MapPin size={14} strokeWidth={1.5} className="text-slate-400" />
        {curriculum.location}
      </div>

      <p className="mt-2 text-sm text-slate-500">
        {formatCategory(curriculum.category)}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
        <span className="inline-flex items-center gap-1.5 text-slate-500">
          <Mail size={14} strokeWidth={1.5} className="text-slate-400" />
          {curriculum.email}
        </span>

        {curriculum.github && (
          <a
            href={curriculum.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-900"
          >
            <Globe size={14} strokeWidth={1.5} className="text-slate-400" />
            GitHub
          </a>
        )}

        {curriculum.linkedin && (
          <a
            href={curriculum.linkedin}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-900"
          >
            <Globe size={14} strokeWidth={1.5} className="text-slate-400" />
            LinkedIn
          </a>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between text-xs text-slate-500">
        <span>
          {new Date(curriculum.created_at).toLocaleDateString("pt-BR")}
        </span>

        <Link
          to={`/curriculums/${curriculum.id}`}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Ver currículo
        </Link>
      </div>
    </article>
  );
}
