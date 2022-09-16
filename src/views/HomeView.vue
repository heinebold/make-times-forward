<template>
  <main-square class="current-schedule">
    <current-schedule-panel :items="schedule" />
  </main-square>
  <main-square>
    <h2>Schedule</h2>

    <full-schedule-panel :items="schedule" :show-past="showPast" />
  </main-square>
</template>

<script setup lang="ts">
import CurrentSchedulePanel from "@/components/CurrentSchedulePanel.vue";
import FullSchedulePanel from "@/components/FullSchedulePanel.vue";
import { computed } from "vue";
import { useSettingsStore } from "@/stores/settings";
import { useScheduleStore } from "@/stores/schedule";
import MainSquare from "@/components/MainSquare.vue";

const scheduleStore = useScheduleStore();
const settingsStore = useSettingsStore();
const schedule = computed(() => scheduleStore.schedule);
const showPast = computed(() => settingsStore.showPastInList);
</script>

<style scoped>
.current-schedule {
  justify-content: space-evenly;
}
</style>
