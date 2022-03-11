<template>
  <div class="settings">
    <h2>Settings</h2>
    <section id="display-settings">
      <h3>Display</h3>
      <section>
        <h4>Time</h4>
        <time-settings />
      </section>
      <section>
        <h4>Schedule View</h4>
        <list-settings />
        <sound-settings />
      </section>
    </section>
  </div>
</template>

<script setup lang="ts">
import TimeSettings from "@/components/settings/TimeSettings.vue";
import ListSettings from "@/components/settings/ListSettings.vue";
import SoundSettings from "@/components/settings/SoundSettings.vue";
</script>

<style scoped>
div.settings > section > section {
  padding: 1em 2em;
}
</style>
