import { describe, expect, it } from "vitest";

import { mount } from "@vue/test-utils";
import dayjs from "dayjs";
import type { TimeSlot } from "../../model/TimeSlot";
import EditItem from "../EditItem.vue";

const demoItem: TimeSlot = {
  id: "demo-1",
  title: "Demo",
  start: dayjs("2024-05-04T10:00"),
  end: dayjs("2024-05-04T11:00"),
};

const lastEmitted = (wrapper: ReturnType<typeof mount>) =>
  wrapper.emitted("update:modelValue")?.at(-1)?.[0] as TimeSlot;

describe("The EditItem component", () => {
  it("renders the given item", () => {
    const wrapper = mount(EditItem, { props: { modelValue: demoItem } });

    expect((wrapper.element as HTMLElement).title).toBe("demo-1");
    expect(wrapper.find("input").element).toBeTruthy();
    expect(
      (wrapper.findAll("input")[0].element as HTMLInputElement).value
    ).toBe("Demo");
    expect(
      (wrapper.findAll("input")[1].element as HTMLInputElement).value
    ).toBe("2024-05-04T10:00");
    expect(
      (wrapper.findAll("input")[2].element as HTMLInputElement).value
    ).toBe("2024-05-04T11:00");
  });

  it("emits a changed title and keeps the remaining fields", async () => {
    const wrapper = mount(EditItem, { props: { modelValue: demoItem } });

    await wrapper.findAll("input")[0].setValue("Changed");

    expect(lastEmitted(wrapper).title).toBe("Changed");
    expect(lastEmitted(wrapper).start.isSame(demoItem.start, "minute")).toBe(
      true
    );
    expect(lastEmitted(wrapper).end.isSame(demoItem.end, "minute")).toBe(true);
    expect(lastEmitted(wrapper).id).toBe("demo-1");
  });

  it("emits a changed start time and keeps title and id", async () => {
    const wrapper = mount(EditItem, { props: { modelValue: demoItem } });

    await wrapper.findAll("input")[1].setValue("2024-06-05T09:30");

    expect(lastEmitted(wrapper).start.hour()).toBe(9);
    expect(lastEmitted(wrapper).start.minute()).toBe(30);
    expect(lastEmitted(wrapper).title).toBe("Demo");
    expect(lastEmitted(wrapper).id).toBe("demo-1");
  });

  it("keeps the end at its previous value when only the start changes", async () => {
    const wrapper = mount(EditItem, {
      props: {
        modelValue: {
          ...demoItem,
          start: dayjs("2024-05-04T10:00"),
          end: dayjs("2024-05-04T10:00"),
        },
      },
    });

    await wrapper.findAll("input")[1].setValue("2024-06-05T09:30");

    expect(
      lastEmitted(wrapper).end.isSame(dayjs("2024-05-04T10:00"), "minute")
    ).toBe(true);
  });

  it("emits a blank item on title change without a given item", async () => {
    const wrapper = mount(EditItem);

    await wrapper.findAll("input")[0].setValue("Fresh");

    const emitted = lastEmitted(wrapper);
    expect(emitted.title).toBe("Fresh");
    expect(emitted.id).toBe("");
  });
});
