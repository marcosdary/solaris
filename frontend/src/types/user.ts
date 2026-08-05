export interface IUserInfoResponse {
  name: string;
  phone: string;
  email: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface IUserUpdateInput {
  name?: string;
  phone?: string;
  email?: string;
} 
