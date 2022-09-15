import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

export type TimeSlot = {
  title: string;
  start: Dayjs;
  end: Dayjs;
  readonly id: string;
};

export function parseSchedule(text: string): TimeSlot[] | null {
  return (
    readRawStoredSchedule(text)
      ?.map((raw: TimeSlotJson) => {
        const rawStart = dayjs(raw.start ?? raw.end ?? null);
        const rawEnd = dayjs(raw.end ?? raw.start ?? null);
        const loadedStart = isNaN(rawStart.minute()) ? rawEnd : rawStart;
        const loadedEnd = isNaN(rawEnd.minute()) ? rawStart : rawEnd;
        const correctDateOrder = !loadedStart.isAfter(loadedEnd, "minute");

        const title = raw.title?.trim() ?? "";
        const start = correctDateOrder ? loadedStart : loadedEnd;
        const end = correctDateOrder ? loadedEnd : loadedStart;
        const id = generateId();

        return { title, start, end, id };
      })
      .filter((t) => !isNaN(t.start.minute()))
      .sort(byStart) ?? null
  );
}

export function stringifySchedule(
  schedule: TimeSlot[],
  space?: string | number
): string {
  return JSON.stringify(schedule, storedFields, space);
}

export function generateId() {
  return `${Math.round(Math.random() * 10000)}-${Math.round(
    Math.random() * 100000
  )}-${Math.round(Math.random() * 10000)}`;
}

export function byStart(t1: TimeSlot, t2: TimeSlot) {
  return t1.start.diff(t2.start, "minutes");
}

type TimeSlotJson = { [key in keyof TimeSlot]?: string };
const storedFields: (keyof TimeSlot)[] = ["title", "start", "end"];

function readRawStoredSchedule(text: string): TimeSlotJson[] | null {
  const parsedJSON = JSON.parse(text, (key, value) => {
    if (key === "" || `${parseInt(key)}` === key) {
      return value ?? undefined;
    }
    if ((storedFields as string[]).includes(key)) {
      return value == null ? undefined : `${value}`;
    }
    return undefined;
  });
  return Array.isArray(parsedJSON) ? parsedJSON : null;
}
