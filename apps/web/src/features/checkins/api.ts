import type {
  CheckInDayResponse,
  CheckInResponse,
  SaveCheckInInput,
} from "@better-days/shared";
import { apiClient } from "@/lib/api-client";

export const checkInsApi = {
  save: (input: SaveCheckInInput) =>
    apiClient.put<CheckInResponse>("/checkins", input),
  day: (date: string) =>
    apiClient.get<CheckInDayResponse>(`/checkins/day?date=${date}`),
};
