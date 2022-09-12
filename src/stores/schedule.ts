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

function readRawStoredSchedule(): object[] {
  try {
    const parsedJSON = JSON.parse(
      localStorage.getItem("schedule") || "",
      (k, v) => {
        return k === "start" || k === "end" ? dayjs(v) : v;
      }
    );
    return Array.isArray(parsedJSON) ? parsedJSON : [];
  } catch (e) {
    return [];
  }
}

function readStoredSchedule(): TimeSlot[] {
  return readRawStoredSchedule().map((v: Partial<TimeSlot>) => ({
    title: v.title ?? "",
    start: v.start ?? dayjs(),
    end: v.end ?? v.start ?? dayjs(),
    id: generateId(),
  }));
}

function saveSchedule(schedule: TimeSlot[]) {
  localStorage.setItem(
    "schedule",
    JSON.stringify(schedule, ["title", "start", "end"])
  );
}

function enforceId(timeSlot: TimeSlot): TimeSlot {
  return timeSlot.id.trim().length
    ? timeSlot
    : { ...timeSlot, id: generateId() };
}

export const useScheduleStore = defineStore("schedule", {
  state: (): State => ({
    schedule: readStoredSchedule(),
  }),
  actions: {
    updateScheduleItem(payload: { index: number; newItem: TimeSlot }) {
      this.schedule[payload.index] = enforceId(payload.newItem);
      saveSchedule(this.schedule);
    },
    addScheduleItem(newItem: TimeSlot) {
      this.schedule[this.schedule.length] = enforceId(newItem);
      saveSchedule(this.schedule);
    },
    deleteScheduleItem(index: number) {
      this.schedule.splice(index, 1);
      saveSchedule(this.schedule);
    },
  },
});
