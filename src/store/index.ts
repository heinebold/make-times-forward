import type { InjectionKey } from "vue";
import { createStore, useStore as baseUseStore, Store } from "vuex";
import dayjs, { Dayjs } from "dayjs";

export interface State {
  time: Dayjs;
}

// define injection key
export const key: InjectionKey<Store<State>> = Symbol();

export function useStore() {
  return baseUseStore(key);
}

export const store = createStore<State>({
  strict: process.env.NODE_ENV !== "production",
  state() {
    return {
      time: dayjs(),
    };
  },
  mutations: {
    updateClock(state) {
      state.time = dayjs();
    },
  },
});

function tickClock() {
  store.commit("updateClock");
  setTimeout(tickClock, 1000 - store.state.time.millisecond());
}

tickClock();
