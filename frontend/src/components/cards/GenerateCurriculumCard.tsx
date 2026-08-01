import type { ICurriculumPDFResponse } from "../../types/curriculumResponse";

interface Props {
  data: ICurriculumPDFResponse;
  onClose(): void;
}

export function GenerateCurriculumCard({ data, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">

      <div className="w-full max-w-md rounded-2xl border border-border-default bg-white p-8">

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <span className="text-4xl">✅</span>
        </div>

        <h2 className="mt-6 text-center text-2xl font-bold text-text-primary">
          Currículo gerado!
        </h2>

        <p className="mt-2 text-center text-[15px] text-text-secondary">
          Seu currículo foi criado com sucesso.
        </p>

        <div className="mt-8 rounded-2xl border border-border-default bg-bg-surface p-5">

          <div>
            <p className="text-[15px] text-text-secondary">
              Nome do arquivo
            </p>

            <p className="mt-1 font-medium text-text-primary break-all">
              {data.name}
            </p>
          </div>

        </div>

        <div className="mt-8 flex flex-col gap-3">

          <button
            onClick={onClose}
            className="rounded-lg py-3 text-[15px] font-medium text-text-secondary transition hover:bg-bg-surface"
          >
            Fechar
          </button>

        </div>

      </div>

    </div>
  );
}
