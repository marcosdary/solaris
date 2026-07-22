export type ActionType =
  | "add_experience"
  | "updated_experience"
  | "delete_experience"
  | "add_education"
  | "update_education"
  | "delete_education"
  | "add_project"
  | "update_project"
  | "delete_project"
  | "add_certification"
  | "update_certification"
  | "delete_certification"
  | "update_personal";

export interface WSRequest<T = Record<string, unknown>> {
  action: ActionType;
  data: T;
  entity_id?: string;
}

export interface WSResponse<T = unknown, E = unknown> {
  action: ActionType | string;
  status: "success" | "error";
  data?: T;
  error?: E;
}