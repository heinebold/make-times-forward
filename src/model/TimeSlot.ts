import type { Dayjs } from "dayjs";

export type TimeSlot = {
  title: string;
  start: Dayjs;
  end: Dayjs;
};
