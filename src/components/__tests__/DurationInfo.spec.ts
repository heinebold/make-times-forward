import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import { mount } from "@vue/test-utils";
import DurationInfo from "../DurationInfo.vue";
import dayjs from "dayjs";
import { createTestingPinia } from "@pinia/testing";
import { setAppClock } from "../../composables/clock";

function mountDurationInfo(start: dayjs.Dayjs, end: dayjs.Dayjs) {
  return mount(DurationInfo, {
    props: { start, end },
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
        }),
      ],
    },
  });
}

describe("The DurationInfo component", () => {
  const now = dayjs("2000-01-01T13:37:42");
  const start = dayjs("2000-01-01T13:40");
  const end = dayjs("2000-01-01T16:20");

  beforeAll(() => {
    setAppClock(() => now);
  });

  afterAll(() => {
    setAppClock(dayjs);
  });

  it("Shows only the start time if start and end are identical", () => {
    const wrapper = mountDurationInfo(start, start);
    expect(wrapper.text()).toEqual("13:40");
  });

  it("Shows start time and end time", () => {
    const wrapper = mountDurationInfo(start, end);
    expect(wrapper.find(".schedule").text()).toEqual("13:40→16:20");
    expect(wrapper.text()).toMatch(/13:40→16:20\s*160 min/);
  });
});
