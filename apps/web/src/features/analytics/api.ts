import type { AnalyticsResponse } from "@better-days/shared";
import { apiClient } from "@/lib/api-client";

export const analyticsApi = {
  // tzOffset is minutes east of UTC so the API buckets hours/weekdays into
  // the user's local clock. Only called client-side (TanStack Query).
  get: () =>
    apiClient.get<AnalyticsResponse>(
      `/analytics?tzOffset=${-new Date().getTimezoneOffset()}`,
    ),
};
