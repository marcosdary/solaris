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
    <Link to={`/curriculums/${curriculum.id}`}>
      <article className="rounded-2xl border border-border-default bg-white p-4 transition hover:border-accent-horizon hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] cursor-pointer sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div>
            <h2 className="truncate text-[15px] font-semibold text-text-primary">
              {curriculum.name}
            </h2>

            <p className="mt-1 text-[15px] text-text-secondary">
              {curriculum.role}
            </p>
          </div>

          <span className="self-start rounded-full bg-accent-horizon/10 px-3 py-1 text-xs font-medium text-accent-horizon sm:self-auto">
            {formatLanguage(curriculum.language)}
          </span>
        </div>

        <div className="mt-3 flex items-center gap-1.5 text-[15px] text-text-secondary">
          <MapPin size={14} strokeWidth={1.5} className="text-text-muted" />
          {curriculum.location}
        </div>

        <p className="mt-2 text-[15px] text-text-secondary">
          {formatCategory(curriculum.category)}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="inline-flex min-w-0 items-center gap-1.5 text-[15px] text-text-secondary">
            <Mail size={14} strokeWidth={1.5} className="shrink-0 text-text-muted" />
            <span className="truncate">{curriculum.email}</span>
          </span>

          {curriculum.github && (
            <span className="inline-flex items-center gap-1.5 text-[15px] text-text-secondary">
              <Globe size={14} strokeWidth={1.5} className="text-text-muted" />
              GitHub
            </span>
          )}

          {curriculum.linkedin && (
            <span className="inline-flex items-center gap-1.5 text-[15px] text-text-secondary">
              <Globe size={14} strokeWidth={1.5} className="text-text-muted" />
              LinkedIn
            </span>
          )}
        </div>
      </article>
    </Link>
  );
}
