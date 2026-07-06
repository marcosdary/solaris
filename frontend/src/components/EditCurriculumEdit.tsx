import { useState } from "react";

import { PersonalInfo } from "./form-curriculum/PersonalInfo";
import { ExperienceForm } from "./form-curriculum/ExperienceForm";
import { EducationForm } from "./form-curriculum/EducationForm";
import { ProjectForm } from "./form-curriculum/ProjectForm";
import { CertificationForm } from "./form-curriculum/CertificationForm";

import type { ICurriculumInput } from "../types/curriculumCreate";
import type { ICurriculumResponse } from "../types/curriculumResponse";
import { CVCategory, Language } from "../config/constants";
import { updateCurriculum } from "../services/api";


interface EditModalProps {
  open: boolean;
  data: ICurriculumResponse
  onClose: () => void;
}

export function CurriculumEditModal({
  open,
  data,
  onClose,
}: EditModalProps) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<ICurriculumInput>(() => ({
    language: data?.language ?? Language.PORTUGUESE,
    category: data?.category ?? CVCategory.BACKEND_DEVELOPER,

    name: data?.name ?? "",
    email: data?.email ?? "",
    role: data?.role ?? "",

    github: data?.github ?? null,
    linkedin: data?.linkedin ?? null,

    phone: data?.phone ?? "",
    location: data?.location ?? "",
    resume: data?.resume ?? "",

    experiences: data?.experiences ?? [],
    educations: data?.educations ?? [],
    projects: data?.projects ?? [],
    certifications: data?.certifications ?? [],
  }));


  async function handleSubmit(
      e: React.SyntheticEvent<HTMLFormElement>
    ) {
      e.preventDefault();
  
      setLoading(true);
  
      try {
        console.log("Depois da mudança.")
        console.log(form);
        const response = await updateCurriculum(form);
        console.log(response)
  
      } catch (error) {
        console.error(error);
  
        alert("Erro ao gerar currículo.");
      } finally {
        setLoading(false);
      }
    }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-8 shadow-xl">

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            Atualizar
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-3xl text-slate-500 hover:text-black"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
  
          <PersonalInfo
            form={form}
            setForm={setForm}
          />
        
          <ExperienceForm
            experiences={form.experiences}
            mode="edit"
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
            mode="edit"
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
            mode="edit"
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
            mode="edit"
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
  
          <div className="flex justify-end gap-3 border-t pt-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-5 py-2 hover:bg-slate-100"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}