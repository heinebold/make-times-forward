import { defineStore } from "pinia";

interface State {
  use12hTime: boolean;
  showPastInList: boolean;
  playSounds: boolean;
  alwaysToday: boolean;
}

export const useSettingsStore = defineStore("settings", {
  state: (): State => ({
    use12hTime: localStorage.getItem("timeDisplayMode") === "12h",
    showPastInList: !!localStorage.getItem("showPastInList"),
    playSounds: !!localStorage.getItem("playSounds"),
    alwaysToday: !!localStorage.getItem("alwaysToday"),
  }),
  actions: {
    set12hTime(use12h: boolean) {
      this.use12hTime = use12h;
      localStorage.setItem("timeDisplayMode", use12h ? "12h" : "24h");
    },
    setShowPastInList(showPastInList: boolean) {
      this.showPastInList = showPastInList;
      if (showPastInList) {
        localStorage.setItem("showPastInList", "showPastInList");
      } else {
        localStorage.removeItem("showPastInList");
      }
    },
    setPlaySounds(playSounds: boolean) {
      this.playSounds = playSounds;
      if (playSounds) {
        localStorage.setItem("playSounds", "playSounds");
      } else {
        localStorage.removeItem("playSounds");
      }
    },
    setAlwaysToday(alwaysToday: boolean) {
      this.alwaysToday = alwaysToday;
      if (alwaysToday) {
        localStorage.setItem("alwaysToday", "alwaysToday");
      } else {
        localStorage.removeItem("alwaysToday");
      }
    },
  },
});
