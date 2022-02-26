<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import MainLogo from "@/components/icons/MainLogo.vue";
import TextClock from "@/components/TextClock.vue";
import { useStore } from "@/store";
import { computed } from "vue";

const store = useStore();
const appTime = computed(() => store.state.time);
</script>

<template>
  <header>
    <h1 title="Mach Mal Voran">Make Times Forward</h1>
    <MainLogo class="logo" />
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
      <TextClock include-seconds :base-time="appTime" />
    </nav>
  </header>

  <main>
    <RouterView />
  </main>
</template>

<style>
@import "@/assets/base.css";

#app {
  width: 100vw;
  margin: 0;
  padding: 0 2rem;

  font-weight: normal;

  display: flex;
  flex-direction: column;
  place-items: center;
}

header {
  --max-header-height: 25vh;
  --min-header-height: 2.5em;

  display: flex;
  place-items: center;
  justify-content: center;
  height: 128px;
  max-height: var(--max-header-height);
  min-height: var(--min-header-height);
  width: 100%;
  max-width: 1280px;
  line-height: 1.5;
  padding: 0 1em;
}

header .logo {
  margin: 0 2rem;
  max-height: var(--max-header-height);
  min-height: var(--min-header-height);
  max-width: 42vw;
}

header h1 {
  flex-basis: 5.5em;
  min-width: 5.5em;
}

main {
  max-height: calc(100vh - 128px);
  max-width: 100%;
  overflow: scroll;
  margin-top: 2vh;
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
  margin-top: 1rem;

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

@media (max-width: 599px) {
  header h1 {
    display: none;
  }
  header .logo {
    margin-left: 0;
    margin-right: 1em;
  }
}

@media (max-height: 299px) {
  header h1 {
    min-width: 10em;
  }
}

h2 {
  margin-bottom: 0.7rem;
}
</style>
