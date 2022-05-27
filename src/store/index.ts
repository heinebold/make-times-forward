import type { InjectionKey } from "vue";
import { createStore, useStore as baseUseStore, Store } from "vuex";
import dayjs, { Dayjs } from "dayjs";
import type { TimeSlot } from "@/model/TimeSlot";

export interface State {
  clock: () => Dayjs;
  time: Dayjs;

  schedule: TimeSlot[];
}

// define injection key
export const key: InjectionKey<Store<State>> = Symbol();

export function useStore() {
  return baseUseStore(key);
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

export const store = createStore<State>({
  strict: import.meta.env.DEV,
  state() {
    const clock = dayjs;

    return {
      clock,
      time: clock(),
      schedule: readStoredSchedule(),
    };
  },
  mutations: {
    updateClock(state) {
      state.time = state.clock();
    },
    updateScheduleItem(state, payload: { index: number; newItem: TimeSlot }) {
      state.schedule[payload.index] = payload.newItem;
      localStorage.setItem("schedule", JSON.stringify(state.schedule));
    },
    addScheduleItem(state, newItem: TimeSlot) {
      state.schedule[state.schedule.length] = newItem;
      localStorage.setItem("schedule", JSON.stringify(state.schedule));
    },
    deleteScheduleItem(state, index: number) {
      state.schedule.splice(index, 1);
      localStorage.setItem("schedule", JSON.stringify(state.schedule));
    },
  },
});

function tickClock() {
  store.commit("updateClock");
  const ms = store.state.time.millisecond();
  const timeout = (ms > 900 ? 2000 : 1000) - ms;
  setTimeout(tickClock, timeout);
}

tickClock();
