import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import type { ICurriculumResponse } from "../../types/curriculumResponse";
import { selectCurriculumByID } from "../../services/curriculum";
import { useAccessToken } from "../../hooks/useAccessToken";

interface Props {
  curriculum: ICurriculumResponse;
}

export function CurriculumCard({ curriculum }: Props) {
  const { id } = useParams();
  const accessToken = useAccessToken();

  const [data, setData] = useState<ICurriculumResponse>(curriculum);

  useEffect(() => {
    if (id && accessToken) {
      selectCurriculumByID(id, accessToken)
        .then(setData)
        .catch(console.error);
    }
  }, [id, accessToken]);

  function formatCategory(category: string) {
    return category
      .split("_")
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" ");
  }

  const languageMap = {
    portuguese: "🇧🇷 Português",
    english: "🇺🇸 Inglês",
    spanish: "🇪🇸 Espanhol",
  };

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">

      {/* Cabeçalho */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            {data.name}
          </h2>

          <p className="mt-1 text-sm font-medium text-blue-600">
            {data.role}
          </p>

          <p className="mt-2 text-sm text-slate-500">
            📍 {data.location}
          </p>
        </div>

        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
          {languageMap[data.language]}
        </span>
      </div>

      {/* Informações */}
      <div className="mt-6 space-y-2 text-sm text-slate-600">
        <p>
          <span className="font-medium">Categoria:</span>{" "}
          {formatCategory(data.category)}
        </p>

        <p>
          <span className="font-medium">E-mail:</span>{" "}
          {data.email}
        </p>
      </div>

      {/* Links */}
      <div className="mt-5 flex flex-wrap gap-3">
        {data.github && (
          <a
            href={data.github}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            GitHub
          </a>
        )}

        {data.linkedin && (
          <a
            href={data.linkedin}
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            LinkedIn
          </a>
        )}
      </div>

      {/* Rodapé */}
      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">

        <span className="text-xs text-slate-500">
          Atualizado em{" "}
          {new Date(data.updated_at).toLocaleDateString("pt-BR")}
        </span>

        <Link
          to={`/curriculums/${data.id}`}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          Ver currículo
        </Link>

      </div>

    </article>
  );
}