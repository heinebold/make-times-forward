import { defineStore } from "pinia";
import type { TimeSlot } from "@/model/TimeSlot";
import { generateId, parseSchedule, stringifySchedule } from "@/model/TimeSlot";

interface State {
  schedule: TimeSlot[];
}

function readStoredSchedule(): TimeSlot[] {
  try {
    return parseSchedule(localStorage.getItem("schedule") ?? "") ?? [];
  } catch (e) {
    return [];
  }
}

function saveSchedule(schedule: TimeSlot[]) {
  localStorage.setItem("schedule", stringifySchedule(schedule));
}

const byStart = (t1: TimeSlot, t2: TimeSlot) =>
  t1.start.diff(t2.start, "minutes");

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
      this.schedule[index] = changedItem;
      saveSchedule(this.schedule.sort(byStart));
    },
    addScheduleItem(newItem: TimeSlot) {
      this.schedule[this.schedule.length] = { ...newItem, id: generateId() };
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
