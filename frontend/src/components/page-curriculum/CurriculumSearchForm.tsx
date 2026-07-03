import { useState } from "react";

import { CVCategory, Language } from "../../config/constants";

interface SearchCurriculumRequest {
  category?: CVCategory;
  language?: Language;
}

interface Props {
  onSearch(payload: SearchCurriculumRequest): void;
}

export function CurriculumSearchForm({ onSearch }: Props) {
  const [category, setCategory] = useState<CVCategory | "">("");
  const [language, setLanguage] = useState<Language | "">("");

  function formatCategory(category: string) {
    return category
      .replaceAll("_", " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    onSearch({
      category: category || undefined,
      language: language || undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm md:flex-row">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as CVCategory | "")}
          className="flex-1 rounded-xl px-4 py-2 text-sm text-slate-700 outline-none"
        >
          <option value="">Todas as categorias</option>

          {Object.values(CVCategory).map((value) => (
            <option key={value} value={value}>
              {formatCategory(value)}
            </option>
          ))}
        </select>

        <div className="hidden w-px bg-slate-200 md:block" />

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language | "")}
          className="flex-1 rounded-xl px-4 py-2 text-sm text-slate-700 outline-none"
        >
          <option value="">Todos os idiomas</option>

          <option value={Language.PORTUGUESE}>
            🇧🇷 Português
          </option>

          <option value={Language.ENGLISH}>
            🇺🇸 English
          </option>

          <option value={Language.SPANISH}>
            🇪🇸 Español
          </option>
        </select>

        <button
          type="submit"
          className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          Buscar
        </button>
      </div>
    </form>
  );
}