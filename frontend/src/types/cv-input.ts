import { CVCategory, Language } from "../config/constants";

export interface ICurriculumInput {
  language: Language;
  category: CVCategory;
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
  role: string;
  company: string;
  location: string;
  start_date: string;
  end_date: string | null;
  activities: IExperienceActivityInput[];
}

export interface IExperienceActivityInput {
  description: string;
}

export interface IEducationInput {
  institution: string;
  degree: string;
  location: string;
  start_date: string;
  end_date: string | null;
}

export interface IProjectInput {
  name: string;
  github: string | null;
  demo_url: string | null;
  start_date: string;
  end_date: string | null;
  descriptions: IProjectDescriptionInput[];
  technologies: IProjectTechnologyInput[];
}

export interface IProjectDescriptionInput {
  description: string;
}

export interface IProjectTechnologyInput {
  technology: string;
}

export interface ICertificationInput {
  institution: string;
  name: string;
  location: string;
  start_date: string;
  end_date: string | null;
}

export interface SearchCurriculums {
  language: Language;
  category: CVCategory;
}