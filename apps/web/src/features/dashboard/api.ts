import type {
  DashboardResponse,
  RecoveryProfileResponse,
  RecoverySetupInput,
} from "@better-days/shared";
import { apiClient } from "@/lib/api-client";

export const dashboardApi = {
  get: () => apiClient.get<DashboardResponse>("/dashboard"),
  saveRecovery: (input: RecoverySetupInput) =>
    apiClient.put<RecoveryProfileResponse>("/dashboard/recovery", input),
};
