import type { 
  IEducationInput,
  ICurriculumInput,
  IExperienceActivityInput,
  IProjectDescriptionInput,
  IExperienceInput,
  IProjectInput,
  IProjectTechnologyInput,
  ICertificationInput
} from "./curriculumCreate";

export interface ICurriculumEdit extends ICurriculumInput {
  experiences: IExperienceEdit[];
  educations: IEducationEdit[];
  projects: IProjectEdit[] | null;
  certifications: ICertificationEdit[] | null;
}

export interface IExperienceEdit extends IExperienceInput {
  id: string;
  depreciated: boolean | null;
  activities: IExperienceActivityEdit[];
}

export interface IExperienceActivityEdit extends IExperienceActivityInput{
  id: string;
  description: string;
}

export interface IEducationEdit extends IEducationInput {
  depreciated: boolean | null;
  id: string;
}

export interface IProjectEdit extends IProjectInput {
  id: string;
  depreciated: boolean | null;
  descriptions: IProjectDescriptionEdit[];
  technologies: IProjectTechnologyEdit[];
}

export interface IProjectDescriptionEdit extends IProjectDescriptionInput {
  id: string;
  description: string;
}

export interface IProjectTechnologyEdit extends IProjectTechnologyInput {
  id: string;
  technology: string;
}

export interface ICertificationEdit extends ICertificationInput {
  id: string;
  depreciated: boolean | null;
}


