export interface IUserInfoResponse {
  name: string;
  phone: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface IUserUpdateInput {
  name?: string;
  phone?: string;
} 
