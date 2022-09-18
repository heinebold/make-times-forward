import { defineStore } from "pinia";
import type { TimeSlot } from "@/model/TimeSlot";
import {
  byStart,
  generateId,
  normalizeTimeSlot,
  parseSchedule,
  stringifySchedule,
} from "@/model/TimeSlot";

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

export const useScheduleStore = defineStore("schedule", {
  state: (): State => ({
    schedule: readStoredSchedule(),
  }),
  actions: {
    updateScheduleItem(changedItem: TimeSlot) {
      const timeSlot = normalizeTimeSlot(changedItem);
      const index = this.schedule.findIndex((t) => t.id === timeSlot.id);
      if (index < 0) {
        throw `No such item: ${timeSlot.id}`;
      }
      this.schedule[index] = timeSlot;
      saveSchedule(this.schedule.sort(byStart));
    },
    addScheduleItem(newItem: TimeSlot) {
      const copiedTimeSlot = { ...newItem, id: generateId() };
      this.schedule[this.schedule.length] = normalizeTimeSlot(copiedTimeSlot);
      saveSchedule(this.schedule.sort(byStart));
    },
    deleteScheduleItem(id: string) {
      const index = this.schedule.findIndex((t) => t.id === id.trim());
      if (index >= 0) {
        this.schedule.splice(index, 1);
        saveSchedule(this.schedule);
      }
    },
    replaceSchedule(newSchedule: TimeSlot[]) {
      this.schedule = newSchedule.sort(byStart);
      saveSchedule(this.schedule);
    },
  },
});
