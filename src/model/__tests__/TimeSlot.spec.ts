import { describe, expect, it } from "vitest";

import dayjs from "dayjs";
import type { TimeSlot } from "../TimeSlot";
import { byStart, generateId, normalizeTimeSlot } from "../TimeSlot";

const base: TimeSlot = {
  id: "1",
  title: "Demo",
  start: dayjs("2024-05-04T10:00"),
  end: dayjs("2024-05-04T11:00"),
};

describe("normalizeTimeSlot", () => {
  it("keeps a valid slot unchanged", () => {
    expect(normalizeTimeSlot(base)).toEqual(base);
  });

  it("swaps start and end if they are in reverse order", () => {
    const reversed = normalizeTimeSlot({
      ...base,
      start: base.end,
      end: base.start,
    });
    expect(reversed.start.isSame(base.start, "minute")).toBe(true);
    expect(reversed.end.isSame(base.end, "minute")).toBe(true);
  });

  it("uses the end as start if the start is invalid", () => {
    const slot = normalizeTimeSlot({
      ...base,
      start: dayjs("not-a-date"),
    });
    expect(slot.start.isSame(base.end, "minute")).toBe(true);
    expect(slot.end.isSame(base.end, "minute")).toBe(true);
  });

  it("uses the start as end if the end is invalid", () => {
    const slot = normalizeTimeSlot({
      ...base,
      end: dayjs("not-a-date"),
    });
    expect(slot.start.isSame(base.start, "minute")).toBe(true);
    expect(slot.end.isSame(base.start, "minute")).toBe(true);
  });

  it("trims the title", () => {
    expect(normalizeTimeSlot({ ...base, title: " hi " }).title).toBe("hi");
  });

  it("generates an id if it is blank", () => {
    expect(normalizeTimeSlot({ ...base, id: " " }).id).toMatch(/^\d+-\d+-\d+$/);
  });
});

describe("byStart", () => {
  const later: TimeSlot = {
    ...base,
    start: dayjs("2024-05-04T12:00"),
    end: dayjs("2024-05-04T13:00"),
  };

  it("orders slots by start time", () => {
    expect(byStart(base, later)).toBeLessThan(0);
    expect(byStart(later, base)).toBeGreaterThan(0);
  });

  it("returns 0 for identical start times", () => {
    expect(byStart(base, { ...base })).toBe(0);
  });
});

describe("generateId", () => {
  it("generates dash separated ids", () => {
    expect(generateId()).toMatch(/^\d+-\d+-\d+$/);
  });
});
