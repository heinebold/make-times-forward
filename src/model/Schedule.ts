import { ReadTimeSlot, TimeSlot } from "@/model/TimeSlot";
import * as t from "io-ts";
import { isRight } from "fp-ts/Either";

const Schedule = t.array(ReadTimeSlot.pipe(TimeSlot));
export type Schedule = t.TypeOf<typeof Schedule>;

export function parseSchedule(text: string): Schedule | null {
  const result = Schedule.decode(JSON.parse(text));
  if (isRight(result)) {
    return result.right;
  }
  if (import.meta.env.MODE !== "production") {
    result.left.forEach((e) =>
      console.warn(e.message, JSON.stringify(e.value))
    );
  }
  return null;
}

export function stringifySchedule(
  schedule: Schedule,
  space?: string | number
): string {
  return JSON.stringify(Schedule.encode(schedule), null, space);
}
