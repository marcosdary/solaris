import { CurriculumCategory, Language } from "../config/constants";

export interface ICurriculumInput {
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
  experiences: IExperienceInput[];
  educations: IEducationInput[];
  projects: IProjectInput[] | null;
  certifications: ICertificationInput[] | null;
}

export interface IExperienceInput {
  id?: string;
  depreciated?: boolean | null;
  role: string;
  company: string;
  location: string;
  start_date: string;
  end_date: string | null;
  activities: IExperienceActivityInput[];
}

export interface IExperienceActivityInput {
  id?: string;
  description: string;
}

export interface IEducationInput {
  id?: string;
  depreciated?: boolean | null;
  institution: string;
  degree: string;
  location: string;
  start_date: string;
  end_date: string | null;
}

export interface IProjectInput {
  id?: string;
  depreciated?: boolean | null;
  name: string;
  github: string | null;
  demo_url: string | null;
  start_date: string;
  end_date: string | null;
  descriptions: IProjectDescriptionInput[];
  technologies: IProjectTechnologyInput[];
}

export interface IProjectDescriptionInput {
  id?: string;
  description: string;
}

export interface IProjectTechnologyInput {
  id?: string;
  technology: string;
}

export interface ICertificationInput {
  id?: string;
  depreciated?: boolean | null;
  institution: string;
  name: string;
  location: string;
  start_date: string;
  end_date: string | null;
}

export interface SearchCurriculums {
  language: Language;
  category: CurriculumCategory;
}

