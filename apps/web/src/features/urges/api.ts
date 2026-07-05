import type {
  CreateUrgeInput,
  UrgeResponse,
  UrgesResponse,
} from "@better-days/shared";
import { apiClient } from "@/lib/api-client";

export const urgesApi = {
  create: (input: CreateUrgeInput) =>
    apiClient.post<UrgeResponse>("/urges", input),
  list: () => apiClient.get<UrgesResponse>("/urges"),
};
