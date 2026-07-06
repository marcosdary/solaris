import { CVCategory, Language } from "../config/constants";

export interface CVResponse {
  name: string;
  mimetype: string;
}

export interface ICurriculum {
  id: string;
  language: Language;
  category: CVCategory;
  name: string;
  role: string;
  email: string;
  github: string;
  linkedin: string;
  location: string;
  created_at: string;
  updated_at: string;
}

export interface ICurriculumResponse extends ICurriculum {
  phone: string;
  location: string;
  resume: string;
  experiences: IExperience[];
  educations: IEducation[];
  projects: IProject[];
  certifications: ICertification[];
}

export interface IExperience {
  id: string;
  role: string;
  company: string;
  location: string;
  start_date: string;
  end_date: string | null;
  period: string;
  activities: IExperienceActivity[];
  created_at: string;
  updated_at: string;
}

export interface IExperienceActivity {
  id: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface IEducation {
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

export interface IProject {
  id: string;
  name: string;
  github: string;
  demo_url: string;
  start_date: string;
  end_date: string | null;
  period: string;
  descriptions: IProjectDescription[];
  technologies: IProjectTechnology[];
  created_at: string;
  updated_at: string;
}

export interface IProjectDescription {
  id: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface IProjectTechnology {
  id: string;
  technology: string;
  created_at: string;
  updated_at: string;
}

export interface ICertification {
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