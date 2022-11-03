import dayjs, { Dayjs, isDayjs } from "dayjs";
import * as t from "io-ts";
import { either } from "fp-ts/Either";

const DayjsType = new t.Type<Dayjs, string, unknown>(
  "Dayjs",
  (value): value is Dayjs => isDayjs(value),
  (value, context) =>
    either.chain(t.string.validate(value, context), (s) => {
      const d = dayjs(s);
      return d.isValid() ? t.success(d) : t.failure(value, context);
    }),
  (d) => d.toISOString()
);

const StoredTimeSlotProps = {
  title: t.string,
  start: DayjsType,
  end: DayjsType,
};

export const ReadTimeSlot = t.partial(StoredTimeSlotProps);
export const WriteTimeSlot = t.strict(StoredTimeSlotProps);
const IdentifiedTimeSlot = t.intersection([
  WriteTimeSlot,
  t.type({ id: t.readonly(t.string) }),
]);

export type ReadTimeSlot = t.TypeOf<typeof ReadTimeSlot>;
export type WriteTimeSlot = t.TypeOf<typeof WriteTimeSlot>;
export type TimeSlot = t.TypeOf<typeof IdentifiedTimeSlot>;

const isValidTimeSlot = (value: unknown): value is TimeSlot =>
  IdentifiedTimeSlot.is(value) &&
  (value.start?.isValid() || value.end?.isValid() || false);

export const TimeSlot = new t.Type<TimeSlot, WriteTimeSlot, ReadTimeSlot>(
  "TimeSlot",
  isValidTimeSlot,
  //
  (v, c) => {
    const result = normalizeTimeSlot(v);
    return isValidTimeSlot(result)
      ? t.success(result)
      : t.failure(v, c, "no valid times in time slot");
  },
  //
  (ts) => ({ title: ts.title, start: ts.start, end: ts.end })
);

export function normalizeTimeSlot(raw: TimeSlot | ReadTimeSlot): TimeSlot {
  const validStart = raw.start?.isValid() ? raw.start : raw.end ?? dayjs(null);
  const validEnd = raw.end?.isValid() ? raw.end : raw.start ?? dayjs(null);
  const correctDateOrder = !validStart.isAfter(validEnd, "minute");
  const rawId = "id" in raw ? raw.id.trim() : "";

  const title = raw.title?.trim() ?? "";
  const start = correctDateOrder ? validStart : validEnd;
  const end = correctDateOrder ? validEnd : validStart;
  const id = rawId || generateId();

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
