export interface CVPayload {
  info: string;
  cv: "portuguese.docx" | "english.docx";
  pdf: boolean;
}

export interface CVResponse {
  name: string;
  mimetype: string;
}