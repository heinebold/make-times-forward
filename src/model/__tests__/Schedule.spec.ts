import { describe, expect, it } from "vitest";

import dayjs from "dayjs";
import type { Schedule } from "../Schedule";
import { parseSchedule, stringifySchedule } from "../Schedule";

describe("stringifySchedule", () => {
  const schedule: Schedule = [
    {
      id: "1-2-3",
      title: "Demo",
      start: dayjs("2024-05-04T10:00"),
      end: dayjs("2024-05-04T11:00"),
    },
  ];

  it("drops runtime-only fields such as the id", () => {
    expect(JSON.parse(stringifySchedule(schedule))).toEqual([
      {
        title: "Demo",
        start: dayjs("2024-05-04T10:00").toJSON(),
        end: dayjs("2024-05-04T11:00").toJSON(),
      },
    ]);
  });

  it("pretty prints if space is given", () => {
    expect(stringifySchedule(schedule, 2)).toMatch(/\n/);
  });
});

describe("parseSchedule", () => {
  it("parses stored JSON back into a sorted schedule", () => {
    const stored = JSON.stringify([
      {
        title: "Later",
        start: dayjs("2024-05-04T12:00").toJSON(),
        end: dayjs("2024-05-04T13:00").toJSON(),
      },
      {
        title: "Earlier",
        start: dayjs("2024-05-04T10:00").toJSON(),
        end: dayjs("2024-05-04T11:00").toJSON(),
      },
    ]);
    const schedule = parseSchedule(stored);
    expect(schedule?.map((s) => s.title)).toEqual(["Earlier", "Later"]);
    expect(schedule?.every((s) => /^\d+-\d+-\d+$/.test(s.id))).toBe(true);
  });

  it("defaults the title for date-only entries", () => {
    const schedule = parseSchedule(
      JSON.stringify([{ start: dayjs("2024-05-04T10:00").toJSON() }]),
    );
    expect(schedule).toHaveLength(1);
    expect(schedule?.[0].title).toEqual("");
  });

  it("skips entries without valid dates", () => {
    const stored = JSON.stringify([
      { title: "No dates at all" },
      { title: "Fine", start: dayjs("2024-05-04T10:00").toJSON() },
    ]);
    expect(parseSchedule(stored)?.map((s) => s.title)).toEqual(["Fine"]);
  });

  it("returns null for JSON values that are not an array", () => {
    expect(parseSchedule(JSON.stringify({ title: "Oops" }))).toBeNull();
    expect(parseSchedule(JSON.stringify("a string"))).toBeNull();
    expect(parseSchedule(JSON.stringify(true))).toBeNull();
  });

  it("returns null on unparsable text instead of throwing", () => {
    expect(parseSchedule("definitely not JSON")).toBeNull();
  });
});
