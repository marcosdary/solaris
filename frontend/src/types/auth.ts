export interface ILoginInput {
  phone: string;
  password: string;
}

export interface IRegisterInput {
  name: string;
  phone: string;
  password: string;
}

export interface IAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface IForgotPasswordInput {
  phone: string;
}

export interface IForgotPasswordResponse {
  message: string;
}

export interface IResetPasswordInput {
  token: string;
  password: string;
}

export interface IResetPasswordResponse {
  message: string;
}
