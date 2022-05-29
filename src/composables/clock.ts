import dayjs, { Dayjs } from "dayjs";
import { readonly, ref } from "vue";

type ClockFunction = () => Dayjs;

const dummyClock = () => dayjs("1970-01-01T13:37:42");
let appClock: ClockFunction = dummyClock;
const time = ref(appClock());

let tickerTimeout: NodeJS.Timeout;

function tickClock() {
  time.value = appClock();
  const ms = time.value.millisecond();
  const timeout = (ms > 900 ? 2000 : 1000) - ms;
  tickerTimeout = setTimeout(tickClock, timeout);
}

export function setAppClock(newClock: ClockFunction) {
  clearTimeout(tickerTimeout);
  appClock = newClock;
  tickClock();
}

export function useClock() {
  return readonly(time);
}

setAppClock(dayjs);
