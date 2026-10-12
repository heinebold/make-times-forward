import { beforeEach, describe, expect, it, vi } from "vitest";

import { mount } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";
import { useSettingsStore } from "../../../stores/settings";
import SoundSettings from "../SoundSettings.vue";

const mountWithSettings = (initialState: object = {}) =>
  mount(SoundSettings, {
    global: {
      plugins: [createTestingPinia({ createSpy: vi.fn, initialState })],
    },
  });

const settings = () => useSettingsStore();

beforeEach(() => {
  localStorage.clear();
});

describe("The SoundSettings component", () => {
  it("starts with an unchecked checkbox by default", () => {
    const input = mountWithSettings().find("input");
    expect((input.element as HTMLInputElement).checked).toBe(false);
  });

  it("starts checked when sounds are enabled", () => {
    const input = mountWithSettings({ settings: { playSounds: true } }).find(
      "input"
    );
    expect((input.element as HTMLInputElement).checked).toBe(true);
  });

  it("updates the store when toggled", async () => {
    const input = mountWithSettings().find("input");

    await input.setValue(true);
    expect(settings().setPlaySounds).toBeCalledWith(true);

    await input.setValue(false);
    expect(settings().setPlaySounds).toBeCalledWith(false);
  });
});
