import { beforeEach, describe, expect, it } from "vitest";

import { createPinia, setActivePinia } from "pinia";
import dayjs from "dayjs";
import type { Schedule } from "../../model/Schedule";
import { parseSchedule, stringifySchedule } from "../../model/Schedule";
import { useScheduleStore } from "../schedule";

const stored = (schedule: Schedule) =>
  localStorage.setItem("schedule", stringifySchedule(schedule));

function currentStored(): Schedule {
  return parseSchedule(localStorage.getItem("schedule") ?? "") ?? [];
}

const demoItem = (start: string, id = "item") => ({
  id,
  title: `Item ${id}`,
  start: dayjs(start),
  end: dayjs(start),
});

describe("The schedule store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("starts with an empty schedule", () => {
    expect(useScheduleStore().schedule).toEqual([]);
  });

  it("initializes with the stored schedule; ids are regenerated", () => {
    stored([
      {
        id: "stored-1",
        title: "Stored",
        start: dayjs("2024-05-04T10:00"),
        end: dayjs("2024-05-04T11:00"),
      },
    ]);
    const schedule = useScheduleStore().schedule;
    expect(schedule.map((slot) => slot.title)).toEqual(["Stored"]);
    expect(schedule.every((slot) => /^\d+-\d+-\d+$/.test(slot.id))).toBe(true);
  });

  it("starts empty if the stored data is unparsable", () => {
    localStorage.setItem("schedule", "⟳⟴ not json");
    expect(useScheduleStore().schedule).toEqual([]);
  });

  describe("adding items", () => {
    it("adds items with fresh ids and keeps the list sorted by start", () => {
      const store = useScheduleStore();
      store.addScheduleItem(demoItem("2024-05-04T14:00"));
      store.addScheduleItem(demoItem("2024-05-04T12:00"));

      expect(store.schedule.map((slot) => slot.start.hour())).toEqual([12, 14]);
      expect(
        store.schedule.every((slot) => /^\d+-\d+-\d+$/.test(slot.id))
      ).toBe(true);
    });

    it("persists the addition, dropping runtime ids", () => {
      const store = useScheduleStore();
      store.addScheduleItem(demoItem("2024-05-04T14:00"));

      expect(currentStored().map((slot) => slot.title)).toEqual([
        store.schedule[0].title,
      ]);
    });
  });

  describe("updating items", () => {
    it("replaces the item with a changed value", () => {
      const store = useScheduleStore();
      store.addScheduleItem(demoItem("2024-05-04T14:00"));
      store.updateScheduleItem({
        ...demoItem("2024-05-04T15:00"),
        id: store.schedule[0].id,
        title: "Changed",
      });

      expect(store.schedule).toHaveLength(1);
      expect(store.schedule[0].title).toBe("Changed");
      expect(store.schedule[0].start.hour()).toBe(15);
    });

    it("throws for an unknown id", () => {
      const store = useScheduleStore();
      expect(() =>
        store.updateScheduleItem(demoItem("2024-05-04T14:00", "nope"))
      ).toThrow();
    });
  });

  describe("deleting items", () => {
    it("removes an item by id and persists", () => {
      const store = useScheduleStore();
      store.replaceSchedule([
        { ...demoItem("2024-05-04T14:00"), id: "keep-me" },
        { ...demoItem("2024-05-04T15:00"), id: "drop-me" },
      ]);

      store.deleteScheduleItem("drop-me");
      expect(store.schedule.map((slot) => slot.id)).toEqual(["keep-me"]);
      expect(currentStored()).toEqual([
        expect.objectContaining({ title: "Item item" }),
      ]);
    });

    it("trims the id and ignores unknown ids", () => {
      const store = useScheduleStore();
      store.replaceSchedule([
        { ...demoItem("2024-05-04T14:00"), id: "keep-me" },
      ]);

      store.deleteScheduleItem(" nope ");
      store.deleteScheduleItem("keep-me  ");
      expect(store.schedule).toHaveLength(0);
    });
  });

  describe("replacing the schedule", () => {
    it("sorts and persists the new schedule", () => {
      const store = useScheduleStore();
      store.replaceSchedule([
        demoItem("2024-05-04T15:00"),
        demoItem("2024-05-04T13:00"),
      ]);

      expect(store.schedule.map((slot) => slot.start.hour())).toEqual([13, 15]);
      expect(currentStored()).toHaveLength(2);
    });
  });
});
