<template>
  <div class="settings">
    <h2>Settings</h2>
    <section id="display-settings">
      <h3>Display</h3>
      <section>
        <h4>Clock</h4>
        <time-settings />
      </section>
      <section>
        <h4>Schedule</h4>
        <schedule-settings />
      </section>
    </section>
    <section id="notification-settings">
      <h3>Notifications</h3>
      <section>
        <sound-settings />
      </section>
    </section>
  </div>
</template>

<script setup lang="ts">
import TimeSettings from "@/components/settings/TimeSettings.vue";
import ScheduleSettings from "@/components/settings/ScheduleSettings.vue";
import SoundSettings from "@/components/settings/SoundSettings.vue";
</script>

<style scoped>
div.settings > section > section {
  padding: 1em 2em;
}
</style>
