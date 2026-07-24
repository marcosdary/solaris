import { useCurriculumForm } from "../hooks/useCurriculumForm";
import type { ICurriculumResponse } from "../types/curriculumResponse";

import { Loading } from "./Loading";
import { CurriculumCard } from "./cards/CurriculumCard";

import { PersonalInfo } from "./form-curriculum/PersonalInfo";
import { ExperienceForm } from "./form-curriculum/ExperienceForm";
import { EducationForm } from "./form-curriculum/EducationForm";
import { ProjectForm } from "./form-curriculum/ProjectForm";
import { CertificationForm } from "./form-curriculum/CertificationForm";

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
        <div className="divide-y divide-slate-100">
          <PersonalInfo form={ctx.form} updateField={ctx.updateField} />

          <ExperienceForm mode={mode} {...ctx.experiences} />

          <EducationForm mode={mode} {...ctx.educations} />

          <ProjectForm mode={mode} {...ctx.projects} />

          <CertificationForm mode={mode} {...ctx.certifications} />
        </div>

        <button
          type="submit"
          disabled={ctx.loading}
          className="w-full rounded-xl bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {mode === "create" ? "Criar currículo" : "Salvar Alterações"}
        </button>
      </form>

      {ctx.loading && <Loading />}

      {ctx.error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {ctx.error}
        </div>
      )}

      {ctx.result && <CurriculumCard curriculum={ctx.result} />}
    </>
  );
}
