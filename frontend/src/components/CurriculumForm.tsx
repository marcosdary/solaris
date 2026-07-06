import { useState } from "react";

import { createCurriculum } from "../services/api";

import { CVCategory, Language } from "../config/constants";
import type { ICurriculumInput } from "../types/curriculumCreate";

import { Loading } from "./Loading";
import { CurriculumCard } from "./cards/CurriculumCard";

import { PersonalInfo } from "./form-curriculum/PersonalInfo";
import { ExperienceForm } from "./form-curriculum/ExperienceForm";
import { EducationForm } from "./form-curriculum/EducationForm";
import { ProjectForm } from "./form-curriculum/ProjectForm";
import { CertificationForm } from "./form-curriculum/CertificationForm";
import type { ICurriculum } from "../types/curriculumResponse";

export function CurriculumForm() {
  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState<ICurriculum | null>(null);

  const [form, setForm] = useState<ICurriculumInput>({
    language: Language.PORTUGUESE,
    category: CVCategory.BACKEND_DEVELOPER,

    name: "",
    email: "",
    role: "",

    github: null,
    linkedin: null,

    phone: "",
    location: "",
    resume: "",

    experiences: [],
    educations: [],
    projects: [],
    certifications: [],
  });

  async function handleSubmit(
    e: React.SyntheticEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);
    setResult(null);

    try {
      const response = await createCurriculum(form);

      setResult(response);
    } catch (error) {
      console.error(error);

      alert("Erro ao gerar currículo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="space-y-8 rounded-2xl border border-slate-100 bg-white p-8 shadow-sm"
      >
        <PersonalInfo
          form={form}
          setForm={setForm}
        />

        <ExperienceForm
          experiences={form.experiences}
          mode="create"
          setExperiences={(experiences) =>
            setForm((old) => ({
              ...old,
              experiences:
                typeof experiences === "function"
                  ? experiences(old.experiences)
                  : experiences,
            }))
          }
        />

        <EducationForm
          educations={form.educations}
          mode="create"
          setEducations={(educations) =>
            setForm((old) => ({
              ...old,
              educations:
                typeof educations === "function"
                  ? educations(old.educations)
                  : educations,
            }))
          }
        />

        <ProjectForm
          projects={form.projects ?? []}
          mode="create"
          setProjects={(projects) =>
            setForm((old) => ({
              ...old,
              projects:
                typeof projects === "function"
                  ? projects(old.projects ?? [])
                  : projects,
            }))
          }
        />

        <CertificationForm
          certifications={form.certifications ?? []}
          mode="create"
          setCertifications={(certifications) =>
            setForm((old) => ({
              ...old,
              certifications:
                typeof certifications === "function"
                  ? certifications(old.certifications ?? [])
                  : certifications,
            }))
          }
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Gerando currículo..." : "Gerar currículo"}
        </button>
      </form>

      {loading && <Loading />}

      {result && <CurriculumCard curriculum={result} />}
    </>
  );
}