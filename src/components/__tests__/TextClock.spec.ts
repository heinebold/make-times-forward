import { describe, it, expect } from "vitest";

import { mount } from "@vue/test-utils";
import TextClock from "../TextClock.vue";
import dayjs from "dayjs";

describe("TextClock", () => {
  it("renders hours and minutes of given time", () => {
    const wrapper = mount(TextClock, {
      props: { time: dayjs("1999-01-31T13:37:42") },
    });
    expect(wrapper.text()).toBe("13:37");
  });

  it("includes prefix", () => {
    const wrapper = mount(TextClock, {
      props: { time: dayjs("1999-01-31T13:37:42"), prefix: "lol" },
    });
    expect(wrapper.text()).toBe("lol13:37");
  });

  it("renders also seconds if told so", () => {
    const wrapper = mount(TextClock, {
      props: { time: dayjs("1999-01-31T13:37:42"), includeSeconds: true },
    });
    expect(wrapper.text()).toBe("13:37:42");
  });

  it("uses 12h format if told so", () => {
    const wrapper = mount(TextClock, {
      props: { time: dayjs("1999-01-31T13:37:42"), use12h: true },
    });
    expect(wrapper.text()).toBe("01:37 pm");
  });

  it("correctly shows seconds in 12h mode", () => {
    const wrapper = mount(TextClock, {
      props: {
        time: dayjs("1999-01-31T03:37:42"),
        use12h: true,
        includeSeconds: true,
      },
    });
    expect(wrapper.text()).toBe("03:37:42 am");
  });
});
