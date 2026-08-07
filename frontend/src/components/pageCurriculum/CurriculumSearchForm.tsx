import { useState } from "react";
import { Search, Filter, X } from "lucide-react";

import { CurriculumCategory, CurriculumCategoryLabel, Language } from "../../config/constants";

interface SearchCurriculumRequest {
  category?: CurriculumCategory;
  language?: Language;
}

interface Props {
  onSearch(payload: SearchCurriculumRequest): void;
}

export function CurriculumSearchForm({ onSearch }: Props) {
  const [category, setCategory] = useState<CurriculumCategory | "">("");
  const [language, setLanguage] = useState<Language | "">("");
  const [isExpanded, setIsExpanded] = useState(false);

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    setIsExpanded(false);

    onSearch({
      category: category || undefined,
      language: language || undefined,
    });
  }

  const hasFilters = category !== "" || language !== "";

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex w-full items-center gap-2 rounded-lg border px-4 py-3 text-[15px] font-medium transition sm:hidden ${
          hasFilters
            ? "border-accent-horizon bg-accent-horizon/5 text-accent-horizon"
            : "border-border-default text-text-secondary hover:text-text-primary"
        }`}
      >
        {isExpanded ? (
          <X size={18} strokeWidth={1.5} />
        ) : (
          <Filter size={18} strokeWidth={1.5} />
        )}
        {hasFilters ? "Filtros ativos" : "Filtrar"}
        {hasFilters && !isExpanded && (
          <span className="ml-auto h-2 w-2 rounded-full bg-accent-horizon" />
        )}
      </button>

      <div
        className={`${
          isExpanded ? "flex" : "hidden"
        } flex-col items-stretch gap-2 sm:flex sm:flex-row sm:items-center`}
      >
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as CurriculumCategory | "")}
          className="flex-1 rounded-md border border-border-default bg-transparent px-4 py-3 text-[15px] text-text-primary focus:border-accent-primary focus:outline-none"
        >
          <option value="">Todas as categorias</option>

          {Object.values(CurriculumCategory).map((value) => (
            <option key={value} value={value}>
              {CurriculumCategoryLabel[value]}
            </option>
          ))}
        </select>

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language | "")}
          className="flex-1 rounded-md border border-border-default bg-transparent px-4 py-3 text-[15px] text-text-primary focus:border-accent-primary focus:outline-none"
        >
          <option value="">Todos os idiomas</option>

          <option value={Language.PORTUGUESE}>
            Português
          </option>

          <option value={Language.ENGLISH}>
            English
          </option>

          <option value={Language.SPANISH}>
            Español
          </option>
        </select>

        <button
          type="submit"
          title="Buscar"
          className="rounded-lg p-3 text-text-secondary transition hover:text-accent-sun sm:self-auto"
        >
          <Search size={18} strokeWidth={1.5} />
        </button>
      </div>
    </form>
  );
}
