export interface RegisterResponse {
  message: string;
  statusMsg?: "success" | "fail";
  user?: User;
  token?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  rePassword: string;
  phone: string;
}

export interface User {
  name: string
  email: string
  role: "user";
}
