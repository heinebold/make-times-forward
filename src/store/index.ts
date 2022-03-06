import type { InjectionKey } from "vue";
import { createStore, useStore as baseUseStore, Store } from "vuex";
import dayjs, { Dayjs } from "dayjs";
import type { TimeSlot } from "@/model/TimeSlot";

export interface State {
  clock: () => Dayjs;
  time: Dayjs;
  use12hTime: boolean;
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
  strict: process.env.NODE_ENV !== "production",
  state() {
    const clock = dayjs;

    return {
      clock,
      time: clock(),
      use12hTime: localStorage.getItem("timeDisplayMode") === "12h",
      schedule: readStoredSchedule(),
    };
  },
  mutations: {
    updateClock(state) {
      state.time = state.clock();
    },
    set12hTime(state, use12h: boolean) {
      state.use12hTime = use12h;
      localStorage.setItem("timeDisplayMode", use12h ? "12h" : "24h");
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
