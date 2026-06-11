import type { CVResponse } from "../types/cv";

interface Props {
  data: CVResponse;
}

export function ResultCard({ data }: Props) {
  const sizeMB = (data.size / 1024 / 1024).toFixed(2);

  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-slate-800">
        Currículo gerado com sucesso
      </h2>

      <div className="space-y-3">
        <div>
          <span className="font-medium">Arquivo:</span>
          <p>{data.name}</p>
        </div>

        <div>
          <span className="font-medium">Tamanho:</span>
          <p>{sizeMB} MB</p>
        </div>

        <a
          href={data.web_view_link}
          target="_blank"
          rel="noreferrer"
          className="inline-flex rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
        >
          Abrir currículo
        </a>
      </div>
    </div>
  );
}