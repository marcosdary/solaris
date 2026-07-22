import type { CurriculumResponse } from "../../types/curriculumResponse";

interface Props {
  data: CurriculumResponse;
  onClose(): void;
}

export function GenerateCurriculumCard({ data, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">

      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">

        {/* Ícone */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <span className="text-4xl">✅</span>
        </div>

        {/* Título */}
        <h2 className="mt-6 text-center text-2xl font-bold text-slate-900">
          Currículo gerado!
        </h2>

        <p className="mt-2 text-center text-slate-600">
          Seu currículo foi criado com sucesso.
        </p>

        {/* Informações */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">

          <div>
            <p className="text-sm text-slate-500">
              Nome do arquivo
            </p>

            <p className="mt-1 font-medium text-slate-800 break-all">
              {data.name}
            </p>
          </div>

        </div>

        {/* Ações */}
        <div className="mt-8 flex flex-col gap-3">

          <button
            onClick={onClose}
            className="rounded-xl py-3 font-medium text-slate-500 transition hover:bg-slate-100"
          >
            Fechar
          </button>

        </div>

      </div>

    </div>
  );
}