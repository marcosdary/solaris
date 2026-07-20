import type { Language, CurriculumCategory } from "../config/constants";

export interface ICurriculumEditPayload {
  language: Language;
  category: CurriculumCategory;
  name: string;
  email: string;
  role: string;
  github: string | null;
  linkedin: string | null;
  phone: string;
  location: string;
  resume: string;
  experiences: IExperienceEditPayload[];
  educations: IEducationEditPayload[];
  projects: IProjectEditPayload[] | null;
  certifications: ICertificationEditPayload[] | null;
}

export interface IExperienceEditPayload {
  id?: string;
  role: string;
  company: string;
  location: string;
  start_date: string;
  end_date: string | null;
  activities: IExperienceActivityEditPayload[];
}

export interface IExperienceActivityEditPayload {
  id?: string;
  description: string;
}

export interface IEducationEditPayload {
  id?: string;
  institution: string;
  degree: string;
  location: string;
  start_date: string;
  end_date: string | null;
}

export interface IProjectEditPayload {
  id?: string;
  name: string;
  github: string | null;
  demo_url: string | null;
  start_date: string;
  end_date: string | null;
  descriptions: IProjectDescriptionEditPayload[];
  technologies: IProjectTechnologyEditPayload[];
}

export interface IProjectDescriptionEditPayload {
  id?: string;
  description: string;
}

export interface IProjectTechnologyEditPayload {
  id?: string;
  technology: string;
}

export interface ICertificationEditPayload {
  id?: string;
  institution: string;
  name: string;
  location: string;
  start_date: string;
  end_date: string | null;
}
