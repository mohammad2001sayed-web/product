export interface LoginResponse {
  message: string;
  statusMsg?: "success" | "fail";
  token?: string;
  user?: { name: string; email: string; role: string };
}