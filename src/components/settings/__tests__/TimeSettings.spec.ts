import { beforeEach, describe, expect, it, vi } from "vitest";

import { mount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import { useSettingsStore } from "../../../stores/settings";
import TimeSettings from "../TimeSettings.vue";

const mountWithSettings = (initialState: object = {}) =>
  mount(TimeSettings, {
    global: {
      plugins: [createTestingPinia({ createSpy: vi.fn, initialState })],
    },
  });

const settings = () => useSettingsStore();

beforeEach(() => {
  localStorage.clear();
});

describe("The TimeSettings component", () => {
  it("starts with an unchecked checkbox by default", () => {
    const input = mountWithSettings().find("input");
    expect((input.element as HTMLInputElement).checked).toBe(false);
  });

  it("starts checked for 12h time", () => {
    const input = mountWithSettings({ settings: { use12hTime: true } }).find(
      "input"
    );
    expect((input.element as HTMLInputElement).checked).toBe(true);
  });

  it("updates the store when toggled", async () => {
    const input = mountWithSettings().find("input");

    await input.setValue(true);
    expect(settings().set12hTime).toBeCalledWith(true);

    await input.setValue(false);
    expect(settings().set12hTime).toBeCalledWith(false);
  });
});
