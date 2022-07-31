<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import MainLogo from "@/components/icons/MainLogo.vue";
import TextClock from "@/components/TextClock.vue";
import { computed } from "vue";
import type { Dayjs } from "dayjs";
import { useSettingsStore } from "@/stores/settings";
import { useClock } from "@/composables/clock";

const settingsStore = useSettingsStore();
const appTime = useClock();
const use12hTime = computed(() => settingsStore.use12hTime);

function clockEmoji(time: Dayjs): string {
  let hour = time.hour() % 12;
  if (time.minute() > 45) {
    hour += 1;
  }
  if (hour == 0) {
    hour = 12;
  }
  let clockIndex = 128335 + hour;
  if (time.minute() > 15 && time.minute() <= 50) {
    clockIndex += 12;
  }
  return String.fromCodePoint(clockIndex);
}
</script>

<template>
  <header>
    <h1 title="Mach Mal Voran">Make Times Forward</h1>
    <MainLogo class="logo" />
    <nav>
      <RouterLink to="/">Display</RouterLink>
      <RouterLink to="/edit-schedule">Edit</RouterLink>
      <RouterLink to="/settings">Settings</RouterLink>
      <RouterLink to="/about">About</RouterLink>
      <TextClock
        :prefix="clockEmoji(appTime) + ' '"
        include-seconds
        :time="appTime"
        :use12h="use12hTime"
      />
    </nav>
  </header>

  <main>
    <RouterView />
  </main>
</template>

<style>
#app {
  --header-height: 8vmin;

  width: 100vw;
  max-width: 100vw;
  max-height: 100vh;
  margin: 0;

  font-weight: normal;

  display: flex;
  flex-direction: column;
  place-items: center;
}

header {
  display: flex;
  place-items: center;
  justify-content: center;
  align-content: center;
  align-items: center;

  min-height: 1.2em;
  max-height: var(--header-height);
  width: 100%;
  overflow: hidden;
}

header .logo {
  margin: 0 1.6em;
  width: var(--header-height);
  height: var(--header-height);
}

header h1 {
  flex-basis: 5.5em;
  line-height: 1.47ex;
  font-size: 3.5vmin;
}

main {
  height: calc(96vh - var(--header-height));
  width: 100%;
  overflow: auto;
  margin-top: 2vh;
  padding: 0;

  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-content: space-around;
}

a {
  text-decoration: none;
  color: var(--color-accent-fg);
  transition: 0.4s;
}

@media (hover: hover) {
  a:hover {
    background-color: var(--color-accent-bg);
  }
}

nav {
  text-align: left;
  font-size: 1rem;

  padding: 1rem 0;

  display: flex;
  place-items: flex-start;
  flex-wrap: wrap;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav > * {
  display: inline-block;
  padding: 0 1rem;
  border-right: 1px solid var(--color-border);
}

nav *:last-child {
  border: 0;
}

@media (max-width: 599px), (max-height: 299px) {
  header h1 {
    display: none;
  }
  header .logo {
    margin-left: 0;
    margin-right: 1em;
  }
}

@media (max-width: 409px) {
  header .textclock {
    display: none;
  }
}

h2 {
  margin-bottom: 0.7rem;
}
</style>
