export interface ICurriculumFileResponse {
  id: string;
  mimetype: string;
  name: string;
  distpath: string;
  url: string;
  template: string;
  created_at: string;
  updated_at: string
}

export interface ICurriculumFileDownloadResponse {
  url: string;
  name: string;
  mimetype: string;
  expires_in_seconds: number;
  created_at: string
}

