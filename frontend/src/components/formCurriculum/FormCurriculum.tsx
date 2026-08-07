import { useCurriculumForm } from "../../hooks/useCurriculumForm";
import type { ICurriculumResponse } from "../../types/curriculumResponse";

import { Loading } from "../Loading";
import { CurriculumCard } from "../cards/CurriculumCard";

import { PersonalInfo } from "./PersonalInfo";
import { ExperienceForm } from "./ExperienceForm";
import { EducationForm } from "./EducationForm";
import { ProjectForm } from "./ProjectForm";
import { CertificationForm } from "./CertificationForm";

interface CurriculumFormProps {
  mode: "create" | "edit";
  initialData?: ICurriculumResponse;
  onSuccess?: (result: ICurriculumResponse) => void;
}

export function CurriculumForm({
  mode,
  initialData,
  onSuccess,
}: CurriculumFormProps) {
  const ctx = useCurriculumForm({ mode, initialData, onSuccess });
  return (
    <>
      <form
        onSubmit={ctx.handleSubmit}
      >
        <div className="divide-y divide-border-default">
          <PersonalInfo form={ctx.form} updateField={ctx.updateField} />

          <ExperienceForm mode={mode} {...ctx.experiences} />

          <EducationForm mode={mode} {...ctx.educations} />

          <ProjectForm mode={mode} {...ctx.projects} />

          <CertificationForm mode={mode} {...ctx.certifications} />
        </div>

        <button
          type="submit"
          disabled={ctx.loading}
          className="w-full rounded-lg px-7 py-3 text-[15px] font-medium text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          style={{
            background: "linear-gradient(135deg, #FFB200 0%, #FF8A00 100%)",
          }}
        >
          {mode === "create" ? "Criar currículo" : "Salvar Alterações"}
        </button>
      </form>

      {ctx.loading && <Loading />}

      {ctx.error && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-[15px] text-red-700">
          {ctx.error}
        </div>
      )}

      {ctx.result && <CurriculumCard curriculum={ctx.result} />}
    </>
  );
}
