import dayjs, { Dayjs } from "dayjs";
import { readonly, ref } from "vue";

type ClockFunction = () => Dayjs;

const dummyClock = () => dayjs("1970-01-01T13:37:42.999Z");
let appClock: ClockFunction = dummyClock;
const time = ref(appClock());

let timer: NodeJS.Timeout;
function clearTimer() {
  clearInterval(timer);
  clearTimeout(timer);
}

function startClock() {
  const millisecond = updateTime();
  adjustClock(millisecond);
}

function tickClock() {
  const millisecond = updateTime();
  if (millisecond > 50 && millisecond < 950) {
    adjustClock(millisecond);
  }
}

function updateTime() {
  return (time.value = appClock()).millisecond();
}

function adjustClock(millisecond: number) {
  const adjustTimeout = (millisecond > 900 ? 2000 : 1000) - millisecond;
  clearTimer();
  timer = setTimeout(restartClockwork, adjustTimeout);
}

function restartClockwork() {
  clearTimer();
  timer = setInterval(tickClock, 1000);
  updateTime();
}

export function setAppClock(newClock: ClockFunction): ClockFunction {
  const oldClock = appClock;
  appClock = newClock;
  startClock();
  return oldClock;
}

export function useClock() {
  return readonly(time);
}

setAppClock(dayjs);
