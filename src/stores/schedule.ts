import dayjs from "dayjs";
import { defineStore } from "pinia";
import type { TimeSlot } from "@/model/TimeSlot";

interface State {
  schedule: TimeSlot[];
}

function readStoredSchedule() {
  try {
    return JSON.parse(localStorage.getItem("schedule") || "", (k, v) => {
      return k === "start" || k === "end" ? dayjs(v) : v;
    });
  } catch (e) {
    return [];
  }
}

export const useScheduleStore = defineStore("schedule", {
  state: (): State => ({
    schedule: readStoredSchedule(),
  }),
  actions: {
    updateScheduleItem(payload: { index: number; newItem: TimeSlot }) {
      this.schedule[payload.index] = payload.newItem;
      localStorage.setItem("schedule", JSON.stringify(this.schedule));
    },
    addScheduleItem(newItem: TimeSlot) {
      this.schedule[this.schedule.length] = newItem;
      localStorage.setItem("schedule", JSON.stringify(this.schedule));
    },
    deleteScheduleItem(index: number) {
      this.schedule.splice(index, 1);
      localStorage.setItem("schedule", JSON.stringify(this.schedule));
    },
  },
});
