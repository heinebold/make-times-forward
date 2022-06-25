import { describe, expect, it } from "vitest";

import { mount } from "@vue/test-utils";
import ElapsedSecondsMeter from "../ElapsedSecondsMeter.vue";

function mountMeter(duration: number, elapsed: number) {
  return mount(ElapsedSecondsMeter, {
    props: { duration, elapsed },
  });
}

describe("The ElapsedSecondsMeter component", () => {
  it.each(["-1", "", "+1"])(
    "has Max = Duration for Elapsed = Duration%s",
    (elapsedAsString) => {
      const duration = 42;
      const elapsed = duration + parseInt("0" + elapsedAsString);
      const wrapper = mountMeter(duration, elapsed);
      expect(
        wrapper.find("meter").element.attributes.getNamedItem("max")?.value
      ).toEqual("" + duration);
    }
  );

  it("has Value = Elapsed for Elapsed < Duration", () => {
    const duration = 42;
    const elapsed = 40;
    const wrapper = mountMeter(duration, elapsed);
    expect(
      wrapper.find("meter").element.attributes.getNamedItem("value")?.value
    ).toEqual("" + elapsed);
  });

  it("has Value = Duration for Elapsed > Duration", () => {
    const duration = 42;
    const elapsed = 50;
    const wrapper = mountMeter(duration, elapsed);
    expect(
      wrapper.find("meter").element.attributes.getNamedItem("value")?.value
    ).toEqual("" + duration);
  });

  it("has a green/yellow boundary at 90% for long enough durations", () => {
    const duration = 1000;
    const elapsed = 50;
    const wrapper = mountMeter(duration, elapsed);
    expect(
      wrapper.find("meter").element.attributes.getNamedItem("low")?.value
    ).toEqual("900");
  });

  it("has a green/yellow boundary 1 min before the end if 90% would leave less than that", () => {
    const duration = 180;
    const elapsed = 50;
    const wrapper = mountMeter(duration, elapsed);
    expect(
      wrapper.find("meter").element.attributes.getNamedItem("low")?.value
    ).toEqual("120");
  });

  it.each([60, 45, 40])(
    "has a green/yellow boundary at 45secs for durations ≤1min",
    (duration: number) => {
      const wrapper = mountMeter(duration, 0);
      expect(
        wrapper.find("meter").element.attributes.getNamedItem("low")?.value
      ).toEqual("45");
    }
  );

  it.each([1000, 180, 51])(
    "has a yellow/red boundary 5secs before the end if that is after the green/yellow one (duration %i)",
    (duration: number) => {
      const wrapper = mountMeter(duration, 0);
      expect(
        wrapper.find("meter").element.attributes.getNamedItem("high")?.value
      ).toEqual("" + (duration - 5));
    }
  );

  it.each([50, 5, 0])(
    "has a yellow/red boundary 1sec after the green/yellow one if the other rule would mess up the order (duration %i)",
    (duration: number) => {
      const wrapper = mountMeter(duration, 0);
      expect(
        wrapper.find("meter").element.attributes.getNamedItem("high")?.value
      ).toEqual("46");
    }
  );
});
