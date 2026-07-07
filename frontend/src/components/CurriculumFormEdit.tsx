import { CurriculumForm } from "./CurriculumForm";
import type { ICurriculumResponse } from "../types/curriculumResponse";

interface CurriculumFormEditProps {
  open: boolean;
  data: ICurriculumResponse;
  onClose: () => void;
}

export function CurriculumFormEdit({
  open,
  data,
  onClose,
}: CurriculumFormEditProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Atualizar</h2>

          <button
            type="button"
            onClick={onClose}
            className="text-3xl text-slate-500 hover:text-black"
          >
            ×
          </button>
        </div>

        <CurriculumForm mode="edit" initialData={data} onSuccess={onClose} />
      </div>
    </div>
  );
}
