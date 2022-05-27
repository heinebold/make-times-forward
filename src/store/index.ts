import type { InjectionKey } from "vue";
import { createStore, useStore as baseUseStore, Store } from "vuex";
import dayjs, { Dayjs } from "dayjs";

export interface State {
  clock: () => Dayjs;
  time: Dayjs;
}

// define injection key
export const key: InjectionKey<Store<State>> = Symbol();

export function useStore() {
  return baseUseStore(key);
}

export const store = createStore<State>({
  strict: import.meta.env.DEV,
  state() {
    const clock = dayjs;

    return {
      clock,
      time: clock(),
    };
  },
  mutations: {
    updateClock(state) {
      state.time = state.clock();
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
