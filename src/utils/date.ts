import type { FirestoreTimestamp } from "../types";

export function normalizeDate(ts: FirestoreTimestamp): Date {
  return ts instanceof Date ? ts : ts.toDate();
}
