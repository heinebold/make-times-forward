import { ReadTimeSlot, TimeSlot, WriteTimeSlot } from "@/model/TimeSlot";
import * as t from "io-ts";
import { isLeft, isRight, left, right } from "fp-ts/Either";
import type { Either } from "fp-ts/Either";

export type Schedule = TimeSlot[];

const Schedule = new t.Type<Schedule, object[], unknown>(
  "Schedule",
  (value: unknown): value is Schedule =>
    Array.isArray(value) && value.every(TimeSlot.is),
  (value, context) => {
    const jsonResult: Either<string, unknown> =
      typeof value === "string" ? tryParse(value) : right(value);
    if (isLeft(jsonResult)) {
      return t.failure(value, context, jsonResult.left);
    }
    const parsedValue = jsonResult.right;
    if (!Array.isArray(parsedValue)) {
      return t.failure(value, context, "Schedule is not an array");
    }
    const timeSlots = parsedValue
      .map(ReadTimeSlot.pipe(TimeSlot).decode)
      .map((v) => {
        if (import.meta.env.MODE !== "production" && isLeft(v)) {
          v.left.forEach((e) =>
            console.warn(e.message, JSON.stringify(e.value))
          );
        }
        return v;
      })
      .filter(isRight)
      .map((r) => r.right);
    return t.success(timeSlots);
  },
  (value) => value.map(WriteTimeSlot.encode)
);

function tryParse(text: string): Either<string, unknown> {
  try {
    return right(JSON.parse(text));
  } catch (e) {
    return left(`${e}`);
  }
}

export function parseSchedule(text: string): Schedule | null {
  const result = Schedule.decode(text);
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
