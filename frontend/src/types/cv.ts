export interface CVPayload {
  info: string;
  cv: "portuguese.docx" | "english.docx";
  dirname: "portuguese" | "english";
  pdf: boolean;
}

export interface CVResponse {
  id: string;
  name: string;
  mimetype: string;
  size: number;
  web_view_link: string;
}