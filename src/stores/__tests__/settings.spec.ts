import { beforeEach, describe, expect, it } from "vitest";

import { createPinia, setActivePinia } from "pinia";
import { useSettingsStore } from "../settings";

describe("The settings store", () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
  });

  it("defaults all settings to false", () => {
    const store = useSettingsStore();
    expect(store.use12hTime).toBe(false);
    expect(store.showPastInList).toBe(false);
    expect(store.playSounds).toBe(false);
    expect(store.alwaysToday).toBe(false);
    expect(store.headerAsFooter).toBe(false);
  });

  it("restores settings from localStorage", () => {
    localStorage.setItem("timeDisplayMode", "12h");
    localStorage.setItem("showPastInList", "showPastInList");
    localStorage.setItem("playSounds", "playSounds");

    const store = useSettingsStore();
    expect(store.use12hTime).toBe(true);
    expect(store.showPastInList).toBe(true);
    expect(store.playSounds).toBe(true);
    expect(store.alwaysToday).toBe(false);
    expect(store.headerAsFooter).toBe(false);
  });

  it("stores the 12h toggle as a mode value", () => {
    const store = useSettingsStore();
    store.set12hTime(true);
    expect(store.use12hTime).toBe(true);
    expect(localStorage.getItem("timeDisplayMode")).toBe("12h");

    store.set12hTime(false);
    expect(localStorage.getItem("timeDisplayMode")).toBe("24h");
  });

  it("toggles a stored flag on and off", () => {
    const store = useSettingsStore();

    store.setPlaySounds(true);
    expect(store.playSounds).toBe(true);
    expect(localStorage.getItem("playSounds")).toBe("playSounds");

    store.setPlaySounds(false);
    expect(store.playSounds).toBe(false);
    expect(localStorage.getItem("playSounds")).toBeNull();
  });

  describe.each([
    {
      action: "setShowPastInList",
      state: "showPastInList",
      key: "showPastInList",
    },
    { action: "setAlwaysToday", state: "alwaysToday", key: "alwaysToday" },
    {
      action: "setHeaderAsFooter",
      state: "headerAsFooter",
      key: "headerAsFooter",
    },
  ] as const)("$action", ({ action, state, key }) => {
    it("stores and removes the flag", () => {
      const store = useSettingsStore();
      store[action](true);
      expect(store[state]).toBe(true);
      expect(localStorage.getItem(key)).not.toBeNull();

      store[action](false);
      expect(store[state]).toBe(false);
      expect(localStorage.getItem(key)).toBeNull();
    });
  });
});
