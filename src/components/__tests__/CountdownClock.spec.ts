import { describe, it, expect } from "vitest";

import { mount } from "@vue/test-utils";
import CountdownClock from "../CountdownClock.vue";
import dayjs from "dayjs";

describe.each(["01", "07"])("A CountdownClock in month %s", (month: string) => {
  describe("with identical 'to' and 'from' times", () => {
    const time = dayjs(`1999-${month}-31T13:37:42`);
    it("includes the prefix", () => {
      const wrapper = mount(CountdownClock, {
        props: { from: time, to: time, prefix: "lol." },
      });
      expect(wrapper.text()).toBe("lol.00:00");
    });

    it("renders seconds if requested", () => {
      const wrapper = mount(CountdownClock, {
        props: { from: time, to: time, includeSeconds: true },
      });
      expect(wrapper.text()).toBe("00:00:00");
    });

    it("shows a placeholder when minus sign is enabled", () => {
      const wrapper = mount(CountdownClock, {
        props: { from: time, to: time, showMinus: true },
      });
      expect(wrapper.text()).toBe("00:00");
      expect(wrapper.html()).toContain(" 00:00");
    });

    it("shows a placeholder when plus sign is enabled", () => {
      const wrapper = mount(CountdownClock, {
        props: { from: time, to: time, showPlus: true },
      });
      expect(wrapper.text()).toBe("00:00");
      expect(wrapper.html()).toContain(" 00:00");
    });

    it("shows a placeholder when both signs are enabled", () => {
      const wrapper = mount(CountdownClock, {
        props: {
          from: time,
          to: time,
          showMinus: true,
          showPlus: true,
          prefix: "x",
        },
      });
      expect(wrapper.text()).toBe("x 00:00");
    });

    it("Seconds are ignored for comparison when not requested", () => {
      const wrapper = mount(CountdownClock, {
        props: {
          from: time,
          to: time.set("seconds", 13),
          showMinus: true,
          showPlus: true,
          prefix: "x",
        },
      });
      expect(wrapper.text()).toBe("x 00:00");
    });

    it("Milliseconds are ignored when seconds are included", () => {
      const wrapper = mount(CountdownClock, {
        props: {
          from: time.set("ms", 9),
          to: time.set("ms", 900),
          includeSeconds: true,
          showMinus: true,
          showPlus: true,
          prefix: "x",
        },
      });
      expect(wrapper.text()).toBe("x 00:00:00");
    });
  });

  describe("counting towards the future (to is after from)", () => {
    const from = dayjs(`1999-${month}-31T13:37:42`);
    const to = dayjs(`1999-${month}-31T14:42:00`);
    it("includes the prefix", () => {
      const wrapper = mount(CountdownClock, {
        props: { from, to, prefix: "lol." },
      });
      expect(wrapper.text()).toBe("lol.01:05");
    });

    it("renders seconds if requested", () => {
      const wrapper = mount(CountdownClock, {
        props: { from, to, includeSeconds: true },
      });
      expect(wrapper.text()).toBe("01:04:18");
    });

    it("shows a minus when minus sign is enabled", () => {
      const wrapper = mount(CountdownClock, {
        props: { from, to, showMinus: true },
      });
      expect(wrapper.text()).toBe("− 01:05");
    });

    it("shows a placeholder when plus sign is enabled", () => {
      const wrapper = mount(CountdownClock, {
        props: { from, to, showPlus: true },
      });
      expect(wrapper.text()).toBe("01:05");
      expect(wrapper.html()).toContain(" 01:05");
    });

    it("shows a minus when both signs are enabled", () => {
      const wrapper = mount(CountdownClock, {
        props: { from, to, showMinus: true, showPlus: true, prefix: "x" },
      });
      expect(wrapper.text()).toBe("x− 01:05");
    });
  });

  describe("counting towards the past (to is before from)", () => {
    const from = dayjs(`1999-${month}-31T14:42:00`);
    const to = dayjs(`1999-${month}-31T13:37:42`);
    it("includes the prefix", () => {
      const wrapper = mount(CountdownClock, {
        props: { from, to, prefix: "lol." },
      });
      expect(wrapper.text()).toBe("lol.01:05");
    });

    it("renders seconds if requested", () => {
      const wrapper = mount(CountdownClock, {
        props: { from, to, includeSeconds: true },
      });
      expect(wrapper.text()).toBe("01:04:18");
    });

    it("shows a placeholder when minus sign is enabled", () => {
      const wrapper = mount(CountdownClock, {
        props: { from, to, showMinus: true },
      });
      expect(wrapper.text()).toBe("01:05");
      expect(wrapper.html()).toContain(" 01:05");
    });

    it("shows a plus when plus sign is enabled", () => {
      const wrapper = mount(CountdownClock, {
        props: { from, to, showPlus: true },
      });
      expect(wrapper.text()).toBe("+ 01:05");
    });

    it("shows a plus when both signs are enabled", () => {
      const wrapper = mount(CountdownClock, {
        props: { from, to, showMinus: true, showPlus: true, prefix: "x" },
      });
      expect(wrapper.text()).toBe("x+ 01:05");
    });
  });
});
