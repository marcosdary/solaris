import { Link } from "react-router-dom";
import type { ICurriculum } from "../../types/curriculumResponse";


interface Props {
  curriculum: ICurriculum;
}

function formatCategory(category: string) {
  return category
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatLanguage(language: string) {
  switch (language) {
    case "portuguese":
      return "🇧🇷 Português";
    case "english":
      return "🇺🇸 English";
    case "spanish":
      return "🇪🇸 Español";
    default:
      return language;
  }
}

export function CurriculumCard({ curriculum }: Props) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
        {/* Cabeçalho */}
        <div className="flex items-start justify-between gap-4">
            <div>
            <h2 className="text-xl font-bold text-slate-800">
                {curriculum.name}
            </h2>

            <p className="mt-1 text-sm font-medium text-blue-600">
                {curriculum.role}
            </p>

            <p className="mt-2 text-sm text-slate-500">
                📍 {curriculum.location}
            </p>
            </div>

            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
            {formatLanguage(curriculum.language)}
            </span>
        </div>

        {/* Categoria */}
        <div className="mt-5">
            <span className="inline-flex rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">
            {formatCategory(curriculum.category)}
            </span>
        </div>

        {/* Contatos */}
        <div className="mt-6 space-y-2 text-sm">
            <p className="truncate text-slate-600">
            📧 {curriculum.email}
            </p>

            {curriculum.github && (
            <p className="truncate">
                <a
                href={curriculum.github}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline"
                >
                💻 GitHub
                </a>
            </p>
            )}

            {curriculum.linkedin && (
            <p className="truncate">
                <a
                href={curriculum.linkedin}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline"
                >
                🔗 LinkedIn
                </a>
            </p>
            )}
        </div>

        {/* Rodapé */}
        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
            <span>
            Criado em{" "}
            {new Date(curriculum.created_at).toLocaleDateString("pt-BR")}
            </span>

            <Link
                to={`/curriculums/${curriculum.id}`}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
            >
                Ver currículo
            </Link>
        </div>

      
    </article>
  );
}