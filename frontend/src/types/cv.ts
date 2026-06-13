export interface CVPayload {
  info: string;
  cv: "portuguese.docx" | "english.docx";
  dirname: "portuguese" | "english";
  pdf: boolean;
}

export interface CVResponse {
  name: string;
  mimetype: string;
}