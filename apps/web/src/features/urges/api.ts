import type {
  CreateUrgeInput,
  ResolveUrgeInput,
  UrgeResponse,
  UrgesResponse,
} from "@better-days/shared";
import { apiClient } from "@/lib/api-client";

export const urgesApi = {
  create: (input: CreateUrgeInput) =>
    apiClient.post<UrgeResponse>("/urges", input),
  list: () => apiClient.get<UrgesResponse>("/urges"),
  get: (id: string) => apiClient.get<UrgeResponse>(`/urges/${id}`),
  resolve: (id: string, input: ResolveUrgeInput) =>
    apiClient.patch<UrgeResponse>(`/urges/${id}/outcome`, input),
};
