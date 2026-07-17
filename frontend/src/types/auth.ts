export interface ILoginInput {
  phone: string;
}

export interface IRegisterInput {
  name: string;
  phone: string;
}

export interface IAuthResponse {
  access_token: string;
}
