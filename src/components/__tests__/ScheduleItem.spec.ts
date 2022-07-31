import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";

import { mount, VueWrapper } from "@vue/test-utils";
import ScheduleItem from "../ScheduleItem.vue";
import dayjs from "dayjs";
import { createTestingPinia } from "@pinia/testing";
import { setAppClock } from "../../composables/clock";

describe("The ScheduleItem component", () => {
  const now = dayjs("2000-01-01T13:37:42Z");
  const start = dayjs("2000-01-01T13:40Z");
  const end = dayjs("2000-01-01T16:20Z");
  const title = "Some event";

  let wrapper: VueWrapper;

  beforeAll(() => {
    setAppClock(() => now);

    wrapper = mount(ScheduleItem, {
      props: { start, end, title },
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
        ],
      },
    });
  });

  afterAll(() => {
    setAppClock(dayjs);
  });

  it("Shows the title", () => {
    expect(wrapper.find(".title").text()).toEqual(title);
  });

  it("Shows start info", () => {
    expect(wrapper.html()).toContain(start.hour());
    expect(wrapper.html()).toContain(start.minute());
  });

  it("Shows end info", () => {
    expect(wrapper.html()).toContain(end.hour());
    expect(wrapper.html()).toContain(end.minute());
  });
});
