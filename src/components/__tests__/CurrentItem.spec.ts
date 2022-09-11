import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import { mount, VueWrapper } from "@vue/test-utils";
import CurrentItem from "../CurrentItem.vue";
import dayjs from "dayjs";
import { createTestingPinia } from "@pinia/testing";
import { setAppClock } from "../../composables/clock";

describe("CurrentItem with a start date in the future", () => {
  const now = dayjs("2000-01-01T13:37:42Z");
  const start = dayjs("2000-01-01T13:40Z");
  const end = dayjs("2000-01-01T16:20Z");
  const title = "Some future event";

  let wrapper: VueWrapper;

  beforeAll(() => {
    setAppClock(() => now);

    wrapper = mount(CurrentItem, {
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

  it("Shows no meter", () => {
    expect(wrapper.findAll("meter").length).toBe(0);
    expect(
      wrapper.findAllComponents({ name: "ElapsedSecondsMeter" })
    ).toHaveLength(0);
  });

  it("Shows duration info", () => {
    expect(wrapper.findComponent({ name: "DurationInfo" }).html()).toContain(
      start.minute()
    );
    expect(wrapper.findComponent({ name: "DurationInfo" }).html()).toContain(
      end.minute()
    );
    expect(wrapper.findComponent({ name: "DurationInfo" }).html()).toContain(
      end.diff(start, "minutes")
    );
  });

  it("Shows countdown to start", () => {
    expect(wrapper.find(".countdown").text()).toEqual("→00:03");
  });
});

describe("CurrentItem with a start date in the past and the end in the future", () => {
  const now = dayjs("2000-01-01T13:37:42Z");
  const start = dayjs("2000-01-01T13:30Z");
  const end = dayjs("2000-01-01T16:20Z");
  const title = "Some ongoing event";

  let wrapper: VueWrapper;

  beforeAll(() => {
    setAppClock(() => now);

    wrapper = mount(CurrentItem, {
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

  it("Shows a meter", () => {
    expect(
      wrapper.findAllComponents({ name: "ElapsedSecondsMeter" })
    ).toHaveLength(1);
  });

  it("Shows duration info", () => {
    expect(wrapper.findComponent({ name: "DurationInfo" }).html()).toContain(
      start.minute()
    );
    expect(wrapper.findComponent({ name: "DurationInfo" }).html()).toContain(
      end.minute()
    );
    expect(wrapper.findComponent({ name: "DurationInfo" }).html()).toContain(
      end.diff(start, "minutes")
    );
  });

  it("Shows countdown to end", () => {
    expect(wrapper.find(".countdown").text()).toEqual("02:43");
  });
});

describe("CurrentItem with an end in the past", () => {
  const now = dayjs("2000-01-01T16:20:42Z");
  const start = dayjs("2000-01-01T13:30Z");
  const end = dayjs("2000-01-01T14:42Z");
  const title = "Some past event";

  let wrapper: VueWrapper;

  beforeAll(() => {
    setAppClock(() => now);

    wrapper = mount(CurrentItem, {
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

  it("Shows no meter", () => {
    expect(wrapper.findAll("meter").length).toBe(0);
    expect(
      wrapper.findAllComponents({ name: "ElapsedSecondsMeter" })
    ).toHaveLength(0);
  });

  it("Shows duration info", () => {
    expect(wrapper.findComponent({ name: "DurationInfo" }).html()).toContain(
      start.minute()
    );
    expect(wrapper.findComponent({ name: "DurationInfo" }).html()).toContain(
      end.minute()
    );
    expect(wrapper.findComponent({ name: "DurationInfo" }).html()).toContain(
      end.diff(start, "minutes")
    );
  });

  it("Shows time since the end", () => {
    expect(wrapper.find(".countdown").text()).toMatch(/^\+\s*01:38$/);
  });
});
