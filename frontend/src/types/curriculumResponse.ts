import { CurriculumCategory, Language } from "../config/constants";

export interface CurriculumResponse {
  name: string;
  mimetype: string;
}

export interface ICurriculumResponse {
  id: string;
  language: Language;
  category: CurriculumCategory;
  name: string;
  role: string;
  email: string;
  github: string;
  linkedin: string;
  created_at: string;
  updated_at: string;
  phone: string;
  location: string;
  resume: string;
  experiences: IExperienceResponse[];
  educations: IEducationResponse[];
  projects: IProjectResponse[];
  certifications: ICertificationResponse[];
}

export interface IExperienceResponse {
  id: string;
  role: string;
  company: string;
  location: string;
  start_date: string;
  end_date: string | null;
  period: string;
  activities: IExperienceActivityResponse[];
  created_at: string;
  updated_at: string;
}

export interface IExperienceActivityResponse {
  id: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface IEducationResponse {
  id: string;
  institution: string;
  degree: string;
  location: string;
  start_date: string;
  end_date: string | null;
  period: string;
  created_at: string;
  updated_at: string;
}

export interface IProjectResponse {
  id: string;
  name: string;
  github: string;
  demo_url: string;
  start_date: string;
  end_date: string | null;
  period: string;
  descriptions: IProjectDescriptionResponse[];
  technologies: IProjectTechnologyResponse[];
  created_at: string;
  updated_at: string;
}

export interface IProjectDescriptionResponse {
  id: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface IProjectTechnologyResponse {
  id: string;
  technology: string;
  created_at: string;
  updated_at: string;
}

export interface ICertificationResponse {
  id: string;
  institution: string;
  name: string;
  location: string;
  start_date: string;
  end_date: string | null;
  period: string;
  created_at: string;
  updated_at: string;
}