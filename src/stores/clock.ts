import { defineStore } from "pinia";
import type { PiniaPlugin } from "pinia";
import dayjs, { Dayjs } from "dayjs";

interface State {
  clock: () => Dayjs;
  time: Dayjs;
}

export const useClockStore = defineStore("clock", {
  state: (): State => {
    const clock = dayjs;
    return {
      clock,
      time: clock(),
    };
  },
  actions: {
    updateClock() {
      this.time = this.clock();
    },
  },
});

export const clockPlugin: PiniaPlugin = ({ store }) => {
  if (isClockStore(store)) {
    tickClock(store);
  }
};

type ClockStore = { updateClock: () => unknown; time: Dayjs };

function isClockStore(o: object): o is ClockStore {
  const hasRequiredFields = (
    x: object
  ): x is { updateClock: unknown; time: unknown } =>
    "updateClock" in x && "updateClock" in x;
  return (
    hasRequiredFields(o) &&
    typeof o.updateClock === "function" &&
    o.time instanceof dayjs
  );
}

function tickClock(store: ClockStore) {
  store.updateClock();
  const ms = store.time.millisecond();
  const timeout = (ms > 900 ? 2000 : 1000) - ms;
  setTimeout(() => tickClock(store), timeout);
}
