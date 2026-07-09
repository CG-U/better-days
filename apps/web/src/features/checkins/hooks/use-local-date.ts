"use client";

import { useSyncExternalStore } from "react";

export type Period = "morning" | "evening";

/** Evening check-ins open at 5pm local time. */
const EVENING_START_HOUR = 17;

const emptySubscribe = () => () => {};

function getLocalDate(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export function getLocalPeriod(): Period {
  return new Date().getHours() < EVENING_START_HOUR ? "morning" : "evening";
}

/**
 * The check-in day is the user's *local* calendar day, which the server
 * (possibly in another timezone) cannot derive. Returns null on the server so
 * the markup matches on hydration.
 */
export function useLocalDate(): string | null {
  return useSyncExternalStore(emptySubscribe, getLocalDate, () => null);
}
