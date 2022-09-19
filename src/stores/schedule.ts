import { defineStore } from "pinia";
import type { TimeSlot } from "@/model/TimeSlot";
import { byStart, generateId, normalizeTimeSlot } from "@/model/TimeSlot";
import { parseSchedule, stringifySchedule } from "@/model/Schedule";
import type { Schedule } from "@/model/Schedule";

interface State {
  schedule: Schedule;
}

function readStoredSchedule(): Schedule {
  try {
    return parseSchedule(localStorage.getItem("schedule") ?? "") ?? [];
  } catch (e) {
    return [];
  }
}

function saveSchedule(schedule: Schedule) {
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
    replaceSchedule(newSchedule: Schedule) {
      this.schedule = newSchedule.sort(byStart);
      saveSchedule(this.schedule);
    },
  },
});
