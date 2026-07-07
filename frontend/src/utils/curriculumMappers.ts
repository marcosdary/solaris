import type {
  ICertificationInput,
  IEducationInput,
  IExperienceInput,
  IProjectInput,
} from "../types/curriculumCreate";
import type {
  ICertificationResponse,
  IEducationResponse,
  IExperienceResponse,
  IProjectResponse,
} from "../types/curriculumResponse";

export function cleanExperience(
  exp: IExperienceResponse
): IExperienceInput {
  return {
    id: exp.id,
    role: exp.role,
    company: exp.company,
    location: exp.location,
    start_date: exp.start_date,
    end_date: exp.end_date,
    activities: exp.activities.map((a) => ({
      id: a.id,
      description: a.description,
    })),
  };
}

export function cleanEducation(
  edu: IEducationResponse
): IEducationInput {
  return {
    id: edu.id,
    institution: edu.institution,
    degree: edu.degree,
    location: edu.location,
    start_date: edu.start_date,
    end_date: edu.end_date,
  };
}

export function cleanProject(
  proj: IProjectResponse
): IProjectInput {
  return {
    id: proj.id,
    name: proj.name,
    github: proj.github,
    demo_url: proj.demo_url,
    start_date: proj.start_date,
    end_date: proj.end_date,
    descriptions: proj.descriptions.map((d) => ({
      id: d.id,
      description: d.description,
    })),
    technologies: proj.technologies.map((t) => ({
      id: t.id,
      technology: t.technology,
    })),
  };
}

export function cleanCertification(
  cert: ICertificationResponse
): ICertificationInput {
  return {
    id: cert.id,
    institution: cert.institution,
    name: cert.name,
    location: cert.location,
    start_date: cert.start_date,
    end_date: cert.end_date,
  };
}
