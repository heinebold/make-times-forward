<template>
  <div class="about">
    <h2>About</h2>
    <section v-if="updateAvailable">
      <h3>🆙 Update available 🆕</h3>
      <p>A new version of the app is available.</p>
      <button
        class="update"
        :disabled="updating || !updateAvailable"
        @click="updateClick"
      >
        {{ updating ? "Updating..." : "Update now" }}
      </button>
    </section>
    <section>
      <h3>Attribution</h3>
      <p>
        <a href="https://www.flaticon.com/free-icons/productivity"
          >Productivity icons created by monkik - Flaticon</a
        >
      </p>
      <p>
        <a href="https://orangefreesounds.com/single-ding-dong-tubular-bell/"
          >Single Ding Dong Tubular Bell by Alexander - Orange Free Sounds</a
        >
      </p>
      <h3>Open Source projects (all MIT license):</h3>
      <ul>
        <li><a href="https://vuejs.org/">Vue 3</a></li>
        <li><a href="https://router.vuejs.org/">vue-router</a></li>
        <li><a href="https://pinia.vuejs.org/">pinia</a></li>
        <li><a href="https://day.js.org/">dayjs</a></li>
        <li><a href="https://vue-final-modal.org/">vue-final-modal</a></li>
        <li>
          <a href="https://sherwinshen.github.io/vue3-text-clamp"
            >vue3-text-clamp</a
          >
        </li>
        <li>
          <a href="https://github.com/eligrey/FileSaver.js">file-saver</a>
        </li>
      </ul>
    </section>
    <section>
      <h3>Disclaimer</h3>
      <p>
        This is a private page, I do not earn any money with it and only intend
        to use it myself. The only reason you find it on the internet is because
        I want to access it with my phone.
      </p>
      <p>
        If you came here by yourself and do not have this link personally from
        me (the guy in the domain name), but you still have complaints about
        this page, the recommended solution is clicking your browser's back
        button.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useServiceWorker } from "@/composables/serviceWorker";
import { ref } from "vue";

const { updateAvailable, updateApp } = useServiceWorker();
const updating = ref(false);

function updateClick() {
  updating.value = true;
  updateApp(true).catch(() => (updating.value = false));
}
</script>

<style scoped>
.about {
  padding: 1em;
  max-height: calc(100vh - var(--header-height));
}
.about section {
  margin: 1em;
}

button.update {
  margin-top: 0.5em;
  margin-bottom: 0.8em;
  padding: 0.2em;
  font-size: 110%;
}
</style>
