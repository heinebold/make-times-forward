import dayjs from "dayjs";
import type { TimeSlot } from "@/model/TimeSlot";
import { byStart, generateId, normalizeTimeSlot } from "@/model/TimeSlot";

export type Schedule = TimeSlot[];

export function parseSchedule(text: string): Schedule | null {
  return (
    readRawStoredSchedule(text)
      ?.map((json: TimeSlotJson) => {
        const start = dayjs(json.start ?? json.end ?? null);
        const end = dayjs(json.end ?? json.start ?? null);
        const title = json.title ?? "";
        const id = generateId();
        return normalizeTimeSlot({ title, start, end, id });
      })
      .filter((t) => !isNaN(t.start.minute()))
      .sort(byStart) ?? null
  );
}

export function stringifySchedule(
  schedule: Schedule,
  space?: string | number
): string {
  return JSON.stringify(schedule, storedFields, space);
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
