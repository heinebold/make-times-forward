import type { Dayjs } from "dayjs";

export type TimeSlot = {
  title: string;
  start: Dayjs;
  end: Dayjs;
  readonly id: string;
};

export function normalizeTimeSlot(raw: TimeSlot) {
  const normalizedStart = isNaN(raw.start.minute()) ? raw.end : raw.start;
  const normalizedEnd = isNaN(raw.end.minute()) ? raw.start : raw.end;
  const correctDateOrder = !normalizedStart.isAfter(normalizedEnd, "minute");

  const title = raw.title.trim();
  const start = correctDateOrder ? normalizedStart : normalizedEnd;
  const end = correctDateOrder ? normalizedEnd : normalizedStart;
  const id = raw.id.trim() || generateId();

  return { title, start, end, id };
}

export function generateId() {
  return `${Math.round(Math.random() * 10000)}-${Math.round(
    Math.random() * 100000
  )}-${Math.round(Math.random() * 10000)}`;
}

export function byStart(t1: TimeSlot, t2: TimeSlot) {
  return t1.start.diff(t2.start, "minutes");
}
