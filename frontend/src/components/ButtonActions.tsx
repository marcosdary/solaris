import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";

import type { ICurriculumResponse } from "../types/curriculumResponse";

interface ActionButtonsProps {
  onDelete: () => void;
  data: ICurriculumResponse
}

export function ActionButtons({
  onDelete,
  data
}: ActionButtonsProps) {
  return (
    <div className="flex items-center gap-1">
      <Link
        to={`/curriculums/${data.id}/edit`}
        title="Editar"
        className="rounded-lg p-2 text-text-secondary transition hover:bg-accent-horizon/10 hover:text-accent-horizon"
      >
        <Pencil size={16} />
      </Link>

      <button
        onClick={onDelete}
        title="Excluir"
        className="rounded-lg p-2 text-text-secondary transition hover:bg-red-50 hover:text-red-600"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
