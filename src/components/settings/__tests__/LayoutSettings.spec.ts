import { beforeEach, describe, expect, it, vi } from "vitest";

import { mount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import { useSettingsStore } from "../../../stores/settings";
import LayoutSettings from "../LayoutSettings.vue";

const mountWithSettings = (initialState: object = {}) =>
  mount(LayoutSettings, {
    global: {
      plugins: [createTestingPinia({ createSpy: vi.fn, initialState })],
    },
  });

const settings = () => useSettingsStore();

beforeEach(() => {
  localStorage.clear();
});

describe("The LayoutSettings component", () => {
  it("starts with an unchecked checkbox by default", () => {
    const input = mountWithSettings().find("input");
    expect((input.element as HTMLInputElement).checked).toBe(false);
  });

  it("starts checked when the main menu is moved to the bottom", () => {
    const input = mountWithSettings({
      settings: { headerAsFooter: true },
    }).find("input");
    expect((input.element as HTMLInputElement).checked).toBe(true);
  });

  it("updates the store when toggled", async () => {
    const input = mountWithSettings().find("input");

    await input.setValue(true);
    expect(settings().setHeaderAsFooter).toBeCalledWith(true);

    await input.setValue(false);
    expect(settings().setHeaderAsFooter).toBeCalledWith(false);
  });
});
