export type JobSite =
  | "linkedin"
  | "indeed";

export interface Job {
  id: string;
  site: string;
  job_url: string;
  title: string;
  company: string;
  location: string;
  job_level: string | null;
  job_function: string | null;
  description: string;
  company_url: string;
};

export interface JobSearchRequest {
  search: string;
  sites: JobSite[];
  location: string;
  pages: number;
  country_indeed: string;
  hours_publi: number;
  is_remote: boolean;
  linkedin_fetch_description: boolean;
};

