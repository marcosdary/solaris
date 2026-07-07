import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import { CurriculumFormEdit } from "./CurriculumFormEdit";
import type { ICurriculumResponse } from "../types/curriculumResponse";

interface ActionButtonsProps {
  onDelete: () => void;
  data: ICurriculumResponse
}

export function ActionButtons({
  onDelete,
  data
}: ActionButtonsProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
        >
          <Pencil size={16} />
          Atualizar
        </button>

        <button
          onClick={onDelete}
          className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100"
        >
          <Trash2 size={16} />
          Excluir
        </button>
      </div>

      <CurriculumFormEdit
        open={open}
        data={data}
        onClose={() => setOpen(false)}
      />
    </>
  );
}