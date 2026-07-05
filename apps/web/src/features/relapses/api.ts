import type {
  CreateRelapseInput,
  RelapseResponse,
  RelapsesResponse,
} from "@better-days/shared";
import { apiClient } from "@/lib/api-client";

export const relapsesApi = {
  create: (input: CreateRelapseInput) =>
    apiClient.post<RelapseResponse>("/relapses", input),
  list: () => apiClient.get<RelapsesResponse>("/relapses"),
};
