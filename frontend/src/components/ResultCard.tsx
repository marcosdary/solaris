import type { CVResponse } from "../types/cv";

interface Props {
  data: CVResponse;
}

export function ResultCard({ data }: Props) {

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

      </div>
    </div>
  );
}