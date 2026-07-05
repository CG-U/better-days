import type {
  AuthResponse,
  LoginInput,
  RegisterInput,
} from "@better-days/shared";
import { apiClient } from "@/lib/api-client";

export const authApi = {
  register: (input: RegisterInput) =>
    apiClient.post<AuthResponse>("/auth/register", input),
  login: (input: LoginInput) =>
    apiClient.post<AuthResponse>("/auth/login", input),
  logout: () => apiClient.post<void>("/auth/logout"),
  me: () => apiClient.get<AuthResponse>("/auth/me"),
};
