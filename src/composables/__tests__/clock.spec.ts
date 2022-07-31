import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { setAppClock, useClock } from "../clock";
import dayjs from "dayjs";
import { clearInterval } from "timers";

describe("The setAppClock function", () => {
  const staticClock1 = () => dayjs("1337-03-31T13:37");
  const staticClock2 = () => dayjs("0666-06-06T06:06:06.666");

  it("will return the previous clock", () => {
    setAppClock(staticClock1);
    const retrievedClock = setAppClock(staticClock2);

    expect(retrievedClock).toEqual(staticClock1);
  });

  it("will affect future references to the clock", () => {
    setAppClock(staticClock1);
    const clock = useClock();
    expect(clock.value).toEqual(staticClock1());
  });

  it("will affect existing references to the clock", () => {
    setAppClock(staticClock1);
    const clock = useClock();
    setAppClock(staticClock2);
    expect(clock.value).toEqual(staticClock2());
  });
});

describe("The app clock", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts with the current time", () => {
    const startTime = initTestTimeAtMillisecond(666);
    const clock = useClock();
    expect(clock.value).toEqual(dayjs(startTime));
  });

  it("first updates at the next full second if that is more than 100ms away", () => {
    const startTime = initTestTimeAtMillisecond(666);
    const clock = useClock();

    vi.advanceTimersByTime(333);
    expect(clock.value).toEqual(dayjs(startTime));
    vi.advanceTimersByTime(1);
    expect(clock.value).toEqual(dayjs(startTime).set("ms", 0).add(1, "second"));
  });

  it("first updates at the second next full second if the next one is at most 100ms away", () => {
    const startTime = initTestTimeAtMillisecond(902);
    const clock = useClock();

    vi.advanceTimersByTime(98);
    expect(clock.value).toEqual(dayjs(startTime));
    vi.advanceTimersByTime(500);
    expect(clock.value).toEqual(dayjs(startTime));
    vi.advanceTimersByTime(500);
    expect(clock.value).toEqual(
      dayjs(startTime).set("ms", 0).add(2, "seconds")
    );
  });

  it("updates every second when started", () => {
    const startTime = initTestTimeAtMillisecond(0);
    const clock = useClock();

    for (let i = 1; i < 100; i++) {
      vi.advanceTimersByTime(1000);
      expect(clock.value).toEqual(dayjs(startTime).add(i, "seconds"));
    }
  });

  it("uses one timer only", () => {
    initTestTimeAtMillisecond(0);
    const appClockFunction = vi.fn(dayjs);
    setAppClock(appClockFunction);
    expect(appClockFunction).toBeCalledTimes(1);
    for (let i = 0; i < 500; i++) {
      vi.advanceTimersByTime(1000);
    }
    expect(appClockFunction).toBeCalledTimes(501);
  });

  function initTestTimeAtMillisecond(millisecond: number) {
    const startTime = new Date(2000, 1, 1, 13, 37, 42, millisecond);
    vi.setSystemTime(startTime);
    setAppClock(dayjs);
    return startTime;
  }
});

describe.each([0, 4, 10])(
  "When the system timer deviates by %dms each second",
  (deviationStep: number) => {
    const startTime = new Date(2000, 1, 1, 13, 37, 42, 0);
    const maxDeviation = 50;

    let speedySystemTime: ReturnType<typeof setInterval> | undefined =
      undefined;

    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(startTime);
      speedySystemTime = restartSpeedySystemTime();
      setAppClock(dayjs);
    });
    afterEach(() => {
      clearInterval(speedySystemTime);
      vi.useRealTimers();
    });

    it("the clock is readjusted if time diverges from the full second too far", () => {
      const clock = useClock();

      let lastTickWasTooFar = false;
      for (let i = 1; i < 100; i++) {
        const expectedTime = dayjs(startTime).add(i, "seconds");
        const allowedDeviation =
          deviationStep + (lastTickWasTooFar ? 0 : maxDeviation);

        vi.advanceTimersByTime(1000);
        const actualTime = clock.value;
        const diff = Math.abs(actualTime.diff(expectedTime, "ms"));

        expect(
          diff,
          `@${i}: Time was ${actualTime}, expected ${expectedTime}`
        ).toBeLessThanOrEqual(allowedDeviation);
        lastTickWasTooFar = diff > maxDeviation;
      }
    });

    it.skip("still doesn't update excessively", () => {
      const appClockFunction = vi.fn(dayjs);
      setAppClock(appClockFunction);
      expect(appClockFunction).toBeCalledTimes(1);
      for (let i = 0; i < 500; i++) {
        vi.advanceTimersByTime(1000);
      }
      expect(appClockFunction).toBeCalledTimes(501);
    });

    function restartSpeedySystemTime() {
      return setInterval(() => {
        vi.setSystemTime(
          dayjs(vi.getMockedSystemTime())
            .add(1000 + deviationStep, "ms")
            .toDate()
        );
      }, 1000);
    }
  }
);
