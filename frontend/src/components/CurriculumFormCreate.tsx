import type { ICurriculumResponse } from "../types/curriculumResponse";
import { CurriculumForm } from "./CurriculumForm";

interface CurriculumFormCreateProps {
  onSuccess?: (result: ICurriculumResponse) => void;
}

export function CurriculumFormCreate({ onSuccess }: CurriculumFormCreateProps) {
  return <CurriculumForm mode="create" onSuccess={onSuccess} />;
}
