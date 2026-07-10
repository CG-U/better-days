import type {
  ChangePasswordInput,
  DeleteAccountInput,
  ProfileResponse,
  UpdateProfileInput,
} from "@better-days/shared";
import { apiClient } from "@/lib/api-client";

export const settingsApi = {
  profile: () => apiClient.get<ProfileResponse>("/settings/profile"),
  updateProfile: (input: UpdateProfileInput) =>
    apiClient.put<ProfileResponse>("/settings/profile", input),
  changePassword: (input: ChangePasswordInput) =>
    apiClient.put<void>("/settings/password", input),
  deleteAccount: (input: DeleteAccountInput) =>
    apiClient.delete<void>("/settings/account", input),
};
