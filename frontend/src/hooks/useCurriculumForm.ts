import { useState } from "react";
import type { ICurriculumResponse } from "../types/curriculumResponse";
import type { ICurriculumInput } from "../types/curriculumCreate";
import type { ICurriculumEditPayload } from "../types/curriculumEditPayload";
import { CurriculumCategory, Language } from "../config/constants";
import { createCurriculum, updateCurriculum } from "../services/curriculum";
import { useExperiences } from "./useExperiences";
import { useEducations } from "./useEducations";
import { useProjects } from "./useProjects";
import { useCertifications } from "./useCertifications";
import type { UseExperiencesReturn } from "./useExperiences";
import type { UseEducationsReturn } from "./useEducations";
import type { UseProjectsReturn } from "./useProjects";
import type { UseCertificationsReturn } from "./useCertifications";
import type {
  IExperienceInput,
  IEducationInput,
  IProjectInput,
  ICertificationInput,
} from "../types/curriculumCreate";
import {
  cleanExperience,
  cleanEducation,
  cleanProject,
  cleanCertification,
} from "../utils/curriculumMappers";

export interface UseCurriculumFormReturn {
  form: ICurriculumInput;
  updateField<K extends keyof ICurriculumInput>(
    key: K,
    value: ICurriculumInput[K]
  ): void;
  handleSubmit(e: React.SubmitEvent<HTMLFormElement>, curriculumId?: string): Promise<void>;
  loading: boolean;
  result: ICurriculumResponse | null;
  error: string | null;
  experiences: UseExperiencesReturn<IExperienceInput>;
  educations: UseEducationsReturn<IEducationInput>;
  projects: UseProjectsReturn<IProjectInput>;
  certifications: UseCertificationsReturn<ICertificationInput>;
}

interface UseCurriculumFormOptions {
  mode: "create" | "edit";
  initialData?: ICurriculumResponse;
  onSuccess?: () => void;
}

function emptyForm(): ICurriculumInput {
  return {
    language: Language.PORTUGUESE,
    category: CurriculumCategory.BACKEND_DEVELOPER,
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
  };
}

export function useCurriculumForm({
  mode,
  initialData,
  onSuccess,
}: UseCurriculumFormOptions): UseCurriculumFormReturn {

  const [form, setForm] = useState<ICurriculumInput>(() =>
    initialData
      ? {
          language: initialData.language ?? Language.PORTUGUESE,
          category: initialData.category ?? CurriculumCategory.BACKEND_DEVELOPER,
          name: initialData.name ?? "",
          email: initialData.email ?? "",
          role: initialData.role ?? "",
          github: (initialData as any).github ?? null,
          linkedin: (initialData as any).linkedin ?? null,
          phone: initialData.phone ?? "",
          location: initialData.location ?? "",
          resume: initialData.resume ?? "",
          experiences: [],
          educations: [],
          projects: [],
          certifications: [],
        }
      : emptyForm()
  );

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ICurriculumResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const experiences = useExperiences({
    mode,
    initial: initialData?.experiences?.map(cleanExperience) ?? [],
  });

  const educations = useEducations({
    mode,
    initial: initialData?.educations?.map(cleanEducation) ?? [],
  });

  const projects = useProjects({
    mode,
    initial: initialData?.projects?.map(cleanProject) ?? [],
  });

  const certifications = useCertifications({
    mode,
    initial: initialData?.certifications?.map(cleanCertification) ?? [],
  });

  function updateField<K extends keyof ICurriculumInput>(
    key: K,
    value: ICurriculumInput[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>, curriculumId?: string) {
    e.preventDefault();

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const visibleExperiences = experiences.visible();
      const visibleEducations = educations.visible();
      const visibleProjects = projects.visible();
      const visibleCertifications = certifications.visible();

      const payload: ICurriculumEditPayload = {
        id: curriculumId!,
        language: form.language,
        category: form.category,
        name: form.name,
        email: form.email,
        role: form.role,
        github: form.github,
        linkedin: form.linkedin,
        phone: form.phone,
        location: form.location,
        resume: form.resume,
        experiences: visibleExperiences as ICurriculumEditPayload["experiences"],
        educations: visibleEducations as ICurriculumEditPayload["educations"],
        projects:
          visibleProjects.length > 0
            ? (visibleProjects as ICurriculumEditPayload["projects"])
            : null,
        certifications:
          visibleCertifications.length > 0
            ? (visibleCertifications as ICurriculumEditPayload["certifications"])
            : null,
      };

      const response =
        mode === "create"
          ? await createCurriculum(payload)
          : await updateCurriculum(payload, curriculumId!);

      setResult(response);

      onSuccess?.();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao processar currículo.";
      console.error(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return {
    form,
    updateField,
    handleSubmit,
    loading,
    result,
    error,
    experiences,
    educations,
    projects,
    certifications,
  };
}
