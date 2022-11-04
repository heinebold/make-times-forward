import { ReadTimeSlot, TimeSlot, WriteTimeSlot } from "@/model/TimeSlot";
import * as t from "io-ts";
import type { Either } from "fp-ts/Either";
import { isLeft, isRight, left, right } from "fp-ts/Either";

export type Schedule = TimeSlot[];

const Schedule = new t.Type<Schedule, object[], unknown>(
  "Schedule",
  (value: unknown): value is Schedule =>
    Array.isArray(value) && value.every(TimeSlot.is),
  (value, context) =>
    Array.isArray(value)
      ? t.success(decodeValidTimeSlots(value))
      : t.failure(value, context, "Schedule is not an array"),
  (value) => value.map(WriteTimeSlot.encode)
);

export function parseSchedule(text: string): Schedule | null {
  const jsonResult: Either<string, unknown> = tryParse(text);
  if (isLeft(jsonResult)) {
    if (import.meta.env.MODE !== "production") {
      console.warn(jsonResult.left);
    }
    return null;
  }
  const result = Schedule.decode(jsonResult.right);
  logLeft(result);
  return isRight(result) ? result.right : null;
}

export function stringifySchedule(
  schedule: Schedule,
  space?: string | number
): string {
  return JSON.stringify(Schedule.encode(schedule), null, space);
}

function tryParse(text: string): Either<string, unknown> {
  try {
    return right(JSON.parse(text));
  } catch (e) {
    return left(`${e}`);
  }
}

const decodeValidTimeSlots = (items: unknown[]) =>
  items
    .map(ReadTimeSlot.pipe(TimeSlot).decode)
    .map(logLeft)
    .filter(isRight)
    .map((r) => r.right);

function logLeft<T>(v: t.Validation<T>): t.Validation<T> {
  if (import.meta.env.MODE !== "production" && isLeft(v)) {
    v.left.forEach((e) => console.warn(e.message, JSON.stringify(e.value)));
  }
  return v;
}
