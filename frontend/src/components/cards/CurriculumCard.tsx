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
    <article className="rounded-2xl border border-border-default bg-white p-6 transition hover:border-accent-horizon">

      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-text-primary">
            {data.name}
          </h2>

          <p className="mt-1 text-[15px] font-medium text-accent-horizon">
            {data.role}
          </p>

          <p className="mt-2 text-[15px] text-text-secondary">
            📍 {data.location}
          </p>
        </div>

        <span className="rounded-full bg-accent-horizon/10 px-3 py-1 text-xs font-semibold text-accent-horizon">
          {languageMap[data.language]}
        </span>
      </div>

      <div className="mt-6 space-y-2 text-[15px] text-text-secondary">
        <p>
          <span className="font-medium text-text-primary">Categoria:</span>{" "}
          {formatCategory(data.category)}
        </p>

        <p>
          <span className="font-medium text-text-primary">E-mail:</span>{" "}
          {data.email}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {data.github && (
          <a
            href={data.github}
            target="_blank"
            rel="noreferrer"
            className="text-[15px] font-medium text-text-secondary transition hover:text-accent-horizon"
          >
            GitHub
          </a>
        )}

        {data.linkedin && (
          <a
            href={data.linkedin}
            target="_blank"
            rel="noreferrer"
            className="text-[15px] font-medium text-text-secondary transition hover:text-accent-horizon"
          >
            LinkedIn
          </a>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-border-default pt-5">

        <span className="text-xs text-text-muted">
          Atualizado em{" "}
          {new Date(data.updated_at).toLocaleDateString("pt-BR")}
        </span>

        <Link
          to={`/curriculums/${data.id}`}
          className="rounded-lg px-5 py-2 text-sm font-medium text-white transition hover:brightness-110"
          style={{
            background: "linear-gradient(135deg, #FFB200 0%, #FF8A00 100%)",
          }}
        >
          Ver currículo
        </Link>

      </div>

    </article>
  );
}
