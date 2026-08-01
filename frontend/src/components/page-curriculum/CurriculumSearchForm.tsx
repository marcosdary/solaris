import { useState } from "react";
import { Search } from "lucide-react";

import { CurriculumCategory, Language } from "../../config/constants";

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

  function formatCategory(category: string) {
    return category
      .replaceAll("_", " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    onSearch({
      category: category || undefined,
      language: language || undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex items-center gap-2">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as CurriculumCategory | "")}
          className="flex-1 rounded-md border border-border-default bg-transparent px-4 py-3 text-[15px] text-text-primary focus:border-accent-primary focus:outline-none"
        >
          <option value="">Todas as categorias</option>

          {Object.values(CurriculumCategory).map((value) => (
            <option key={value} value={value}>
              {formatCategory(value)}
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
          className="rounded-lg p-3 text-text-secondary transition hover:text-accent-sun"
        >
          <Search size={18} strokeWidth={1.5} />
        </button>
      </div>
    </form>
  );
}
