import type {
  CopingStrategiesResponse,
  CopingStrategyResponse,
  CreateCopingStrategyInput,
} from "@better-days/shared";
import { apiClient } from "@/lib/api-client";

export const copingApi = {
  list: () => apiClient.get<CopingStrategiesResponse>("/coping-strategies"),
  create: (input: CreateCopingStrategyInput) =>
    apiClient.post<CopingStrategyResponse>("/coping-strategies", input),
  remove: (id: string) => apiClient.delete<void>(`/coping-strategies/${id}`),
  markHelped: (id: string) =>
    apiClient.post<CopingStrategyResponse>(`/coping-strategies/${id}/helped`),
};
