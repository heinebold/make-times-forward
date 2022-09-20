import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

import { mount } from "@vue/test-utils";
import FullSchedulePanel from "../FullSchedulePanel.vue";
import dayjs from "dayjs";
import { createTestingPinia } from "@pinia/testing";
import type { Schedule } from "../../model/Schedule";
import { setAppClock } from "../../composables/clock";

const simpleSchedule: Schedule = [
  {
    id: "past",
    title: "Past",
    start: dayjs("2020-03-01T12:00Z"),
    end: dayjs("2020-03-01T13:30Z"),
  },
  {
    id: "present",
    title: "Present",
    start: dayjs("2020-03-01T13:37Z"),
    end: dayjs("2020-03-01T14:20Z"),
  },
  {
    id: "future",
    title: "Future",
    start: dayjs("2020-03-01T23:00Z"),
    end: dayjs("2020-03-02T00:42Z"),
  },
];

function mountPanel(
  props: {
    showPast: boolean;
    selected?: string | null;
    numbered?: boolean | null;
  },
  items = simpleSchedule
) {
  return mount(FullSchedulePanel, {
    props: { items, ...props },
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
        }),
      ],
    },
  });
}

describe("The FullSchedulePanel component", () => {
  const now = dayjs("2020-03-01T14:00Z");

  beforeAll(() => {
    setAppClock(() => now);
  });

  afterAll(() => {
    setAppClock(dayjs);
  });

  it("Shows every item when showPast is true", () => {
    const wrapper = mountPanel({ showPast: true });
    expect(wrapper.findAll(".schedule-card").length).toBe(3);
    expect(wrapper.text()).toMatch(/Past.*Present.*Future/);
  });

  it("Shows present and future items when showPast is false", () => {
    const wrapper = mountPanel({ showPast: false });
    expect(wrapper.findAll(".schedule-card").length).toBe(2);
    expect(wrapper.text()).toMatch(/Present.*Future/);
  });

  it.each([0, 1, 2])(
    "Marks the selected item if it is visible (#%i)",
    (selected) => {
      const wrapper = mountPanel({
        showPast: true,
        selected: simpleSchedule[selected].id,
      });
      expect(wrapper.findAll(".selected").length).toBe(1);
      expect(wrapper.find(".selected").text()).toContain(
        wrapper.props()["items"][selected].title
      );
    }
  );

  it("Marks nothing as selected if selected item is hidden", () => {
    const wrapper = mountPanel({ showPast: false, selected: "past" });
    expect(wrapper.findAll(".selected").length).toBe(0);
  });

  it.each([undefined, null, "nope", ""])(
    "Marks nothing (so especially not item #0) as selected if no or an invalid selection index (%s) is given",
    (selected) => {
      const wrapper = mountPanel({ showPast: true, selected });
      expect(wrapper.findAll(".selected").length).toBe(0);
    }
  );

  it("Numbers the items correctly when told to", () => {
    const wrapper = mountPanel({ showPast: false, numbered: true });
    expect(wrapper.findAll("label").map((e) => e.text())).toEqual(["1", "2"]);
    expect(wrapper.text()).toMatch(/1\s*Present.*2\s*Future/);
  });

  it("Doesn't show numbers unless told so", () => {
    const wrapper = mountPanel({ showPast: false });
    expect(wrapper.findAll("label").length).toEqual(0);
  });

  it("Doesn't select on click", () => {
    const wrapper = mountPanel({ showPast: false });
    wrapper.find("[title=Future]").element.parentElement?.click();
    expect(wrapper.props()["selected"]).toBeUndefined();
  });

  it.todo(
    //TODO find out how to test the event
    "Emits an event with the right index on click",
    () => {
      const wrapper = mountPanel({ showPast: false });
      wrapper.find("[title=Future]").element.parentElement?.click();
      expect("The index payload of the emitted event").toBe(2);
    }
  );
});
