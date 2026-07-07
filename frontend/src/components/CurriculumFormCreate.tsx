import { CurriculumForm } from "./CurriculumForm";

interface CurriculumFormCreateProps {
  onSuccess?: () => void;
}

export function CurriculumFormCreate({ onSuccess }: CurriculumFormCreateProps) {
  return <CurriculumForm mode="create" onSuccess={onSuccess} />;
}
