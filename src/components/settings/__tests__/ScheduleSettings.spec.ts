import { beforeEach, describe, expect, it, vi } from "vitest";

import { mount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import { useSettingsStore } from "../../../stores/settings";
import ScheduleSettings from "../ScheduleSettings.vue";

const mountWithSettings = (initialState: object = {}) =>
  mount(ScheduleSettings, {
    global: {
      plugins: [createTestingPinia({ createSpy: vi.fn, initialState })],
    },
  });

const settings = () => useSettingsStore();

const inputs = (wrapper: ReturnType<typeof mount>) => wrapper.findAll("input");

beforeEach(() => {
  localStorage.clear();
});

describe("The ScheduleSettings component", () => {
  it("renders two checkboxes", () => {
    expect(inputs(mountWithSettings()).length).toBe(2);
  });

  it("starts unchecked by default", () => {
    const wrapper = mountWithSettings();
    for (const input of inputs(wrapper)) {
      expect((input.element as HTMLInputElement).checked).toBe(false);
    }
  });

  it("starts checked for enabled settings", () => {
    const wrapper = mountWithSettings({
      settings: { showPastInList: true, alwaysToday: true },
    });
    for (const input of inputs(wrapper)) {
      expect((input.element as HTMLInputElement).checked).toBe(true);
    }
  });

  it("updates both store settings when toggled", async () => {
    const wrapper = mountWithSettings();

    await inputs(wrapper)[0].setValue(true);
    await inputs(wrapper)[1].setValue(true);
    expect(settings().setShowPastInList).toBeCalledWith(true);
    expect(settings().setAlwaysToday).toBeCalledWith(true);

    await inputs(wrapper)[0].setValue(false);
    await inputs(wrapper)[1].setValue(false);
    expect(settings().setShowPastInList).toBeCalledWith(false);
    expect(settings().setAlwaysToday).toBeCalledWith(false);
  });
});
