import dayjs from "dayjs";
import { defineStore } from "pinia";
import type { TimeSlot } from "@/model/TimeSlot";

interface State {
  schedule: TimeSlot[];
}

function generateId() {
  return `${Math.round(Math.random() * 10000)}-${Math.round(
    Math.random() * 100000
  )}-${Math.round(Math.random() * 10000)}`;
}

type TimeSlotJson = { [key in keyof TimeSlot]: string };

function readRawStoredSchedule(): TimeSlotJson[] {
  try {
    const parsedJSON = JSON.parse(
      localStorage.getItem("schedule") || "",
      (k, v) => {
        return v === null ? undefined : v;
      }
    );
    return Array.isArray(parsedJSON) ? parsedJSON : [];
  } catch (e) {
    return [];
  }
}

function readStoredSchedule(): TimeSlot[] {
  return readRawStoredSchedule().map((v: TimeSlotJson) => {
    const id = generateId();
    const title = v.title?.trim() ?? "";
    const loadedStart = dayjs(v.start ?? v.end);
    const loadedEnd = dayjs(v.end ?? v.start);
    const correctDateOrder = !loadedStart.isAfter(loadedEnd, "minute");
    const start = correctDateOrder ? loadedStart : loadedEnd;
    const end = correctDateOrder ? loadedEnd : loadedStart;
    return { title, start, end, id };
  });
}

function saveSchedule(schedule: TimeSlot[]) {
  localStorage.setItem(
    "schedule",
    JSON.stringify(schedule, ["title", "start", "end"])
  );
}

const byStart = (t1: TimeSlot, t2: TimeSlot) =>
  t1.start.diff(t2.start, "minutes");

function replaceId(timeSlot: TimeSlot): TimeSlot {
  return { ...timeSlot, id: generateId() };
}

function enforceId(timeSlot: TimeSlot): TimeSlot {
  return timeSlot.id.trim().length ? timeSlot : replaceId(timeSlot);
}

export const useScheduleStore = defineStore("schedule", {
  state: (): State => ({
    schedule: readStoredSchedule(),
  }),
  actions: {
    updateScheduleItem(changedItem: TimeSlot) {
      const index = this.schedule.findIndex((t) => t.id === changedItem.id);
      if (index < 0) {
        throw `No such item: ${changedItem.id}`;
      }
      this.schedule[index] = enforceId(changedItem);
      saveSchedule(this.schedule.sort(byStart));
    },
    addScheduleItem(newItem: TimeSlot) {
      this.schedule[this.schedule.length] = replaceId(newItem);
      saveSchedule(this.schedule.sort(byStart));
    },
    deleteScheduleItem(id: string) {
      const index = this.schedule.findIndex((t) => t.id === id);
      if (index >= 0) {
        this.schedule.splice(index, 1);
        saveSchedule(this.schedule);
      }
    },
  },
});
