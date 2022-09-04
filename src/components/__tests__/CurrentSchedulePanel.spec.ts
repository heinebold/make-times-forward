import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

const mockAudio = { play: vi.fn() };
const mockAudioConstructor = vi.fn(() => mockAudio);
const mockUseSound = vi.fn(() => mockAudio);
vi.stubGlobal("Audio", mockAudioConstructor);

import { mount } from "@vue/test-utils";
import CurrentSchedulePanel from "../CurrentSchedulePanel.vue";
import dayjs from "dayjs";
import { createTestingPinia } from "@pinia/testing";
import type { TimeSlot } from "../../model/TimeSlot";
import { setAppClock } from "../../composables/clock";

function mountPanel(items: TimeSlot[]) {
  return mount(CurrentSchedulePanel, {
    props: { items },
    global: {
      plugins: [
        createTestingPinia({
          initialState: { playSounds: true },
          createSpy: vi.fn,
        }),
      ],
    },
  });
}

describe("The CurrentSchedulePanel component", () => {
  const now = dayjs("2020-03-01T14:00Z");
  const past = {
    title: "Past",
    start: dayjs("2020-03-01T12:00Z"),
    end: dayjs("2020-03-01T13:30Z"),
  };
  const present = {
    title: "Present",
    start: dayjs("2020-03-01T13:37Z"),
    end: dayjs("2020-03-01T14:20Z"),
  };
  const future = {
    title: "Future",
    start: dayjs("2020-03-01T23:00Z"),
    end: dayjs("2020-03-02T00:42Z"),
  };
  const future2 = {
    title: "Future",
    start: dayjs("2020-03-02T01:23Z"),
    end: dayjs("2020-03-02T02:34Z"),
  };
  const simpleSchedule: TimeSlot[] = [past, present, future];

  beforeAll(() => {
    vi.mock("@/composables/sound", () => ({ useSound: mockUseSound }));
    setAppClock(() => now);
  });

  afterAll(() => {
    setAppClock(dayjs);
    vi.unmock("@/composables/sound");
  });

  it("sorts the items", () => {
    const mount1 = mountPanel(simpleSchedule);
    const mount2 = mountPanel([future, past, present]);
    const mount3 = mountPanel([present, past, future]);

    expect(mount2.html()).toEqual(mount1.html());
    expect(mount3.html()).toEqual(mount1.html());
  });

  it("shows a bunch of placeholders when there's no schedule", () => {
    const wrapper = mountPanel([]);
    expect(wrapper.findAll(".current-schedule > *").length).toEqual(3);
    expect(wrapper.findAll(".placeholder").length).toEqual(3);
  });

  it("shows placeholders for previous and next if there's only the current item", () => {
    const wrapper = mountPanel([present]);

    expect(wrapper.findAll(".previous.placeholder").length).toEqual(1);
    expect(wrapper.findAll(".next.placeholder").length).toEqual(1);
    expect(wrapper.findAll(".current").length).toEqual(1);
    expect(wrapper.findAll(".current.placeholder").length).toEqual(0);
  });

  it("shows placeholders for current and next if there's only the previous item", () => {
    const wrapper = mountPanel([past]);

    expect(wrapper.findAll(".previous").length).toEqual(1);
    expect(wrapper.findAll(".previous.placeholder").length).toEqual(0);
    expect(wrapper.findAll(".next.placeholder").length).toEqual(1);
    expect(wrapper.findAll(".current.placeholder").length).toEqual(1);
  });

  it("shows the next item in place of the current one if there's no previous item (only current)", () => {
    const wrapper = mountPanel([future]);

    expect(wrapper.findAll(".previous.placeholder").length).toEqual(1);
    expect(wrapper.findAll(".current").length).toEqual(1);
    expect(wrapper.findAll(".current.placeholder").length).toEqual(0);
    expect(wrapper.findAll(".next.placeholder").length).toEqual(1);
  });

  it("shows the next item in place of the current one if there's no previous item (but another one in the future)", () => {
    const wrapper = mountPanel([future, future2]);

    expect(wrapper.findAll(".previous.placeholder").length).toEqual(1);
    expect(wrapper.findAll(".current").length).toEqual(1);
    expect(wrapper.findAll(".current.placeholder").length).toEqual(0);
    expect(wrapper.findAll(".next").length).toEqual(1);
    expect(wrapper.findAll(".next.placeholder").length).toEqual(0);
  });

  it("shows a progress bar if there are previous and future items but no current one", () => {
    const wrapper = mountPanel([past, future]);

    expect(wrapper.findAll(".previous").length).toEqual(1);
    expect(wrapper.findAll(".previous.placeholder").length).toEqual(0);
    expect(wrapper.findAll(".current.placeholder").length).toEqual(0);
    expect(wrapper.findAll(".next").length).toEqual(1);
    expect(wrapper.findAll(".next.placeholder").length).toEqual(0);

    expect(wrapper.findAll(".current > *").length).toEqual(1);
    expect(wrapper.findAll(".current progress").length).toEqual(1);
  });

  it.each(["previous", "current", "next"])(
    "shows the right content in all cards",
    (itemClass: string) => {
      const wrapper = mountPanel([past, present, future]);

      expect(wrapper.findAll(`.${itemClass}.placeholder`).length).toEqual(0);
      expect(wrapper.findAll(`.${itemClass} > *`).length).toEqual(1);
      expect(wrapper.findAll(`.${itemClass} .schedule-item`).length).toEqual(1);
    }
  );

  it.todo("gets the mocks like I want them", () => {
    mountPanel(simpleSchedule);
    expect(mockAudioConstructor).toBeCalledTimes(0);
    expect(mockUseSound).toBeCalledTimes(1);
  });
});

describe.todo("The DingDong sound on the Current Schedule Panel", () => {
  const now = dayjs("2020-03-01T14:00Z");
  const past = {
    title: "Past",
    start: dayjs("2020-03-01T12:00Z"),
    end: dayjs("2020-03-01T13:30Z"),
  };
  const present = {
    title: "Present",
    start: dayjs("2020-03-01T13:37Z"),
    end: dayjs("2020-03-01T14:20Z"),
  };
  const future = {
    title: "Future",
    start: dayjs("2020-03-01T23:00Z"),
    end: dayjs("2020-03-02T00:42Z"),
  };

  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(now.toDate());
    setAppClock(() => {
      const result = dayjs();
      console.log(result.toISOString());
      return result;
    });
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it("is played when the first item becomes current", () => {
    mountPanel([past, future]);
    vi.setSystemTime(future.start.toDate());
    vi.advanceTimersToNextTimer();
    /* the whole component is not picking up the change in time.
    this is only happening in the test, it works in the app.
    There's obviously a problem with reactivity in the test setup, but WHAT IST IT
     */
    expect(mockAudio.play).toBeCalledTimes(1);
  });
});
