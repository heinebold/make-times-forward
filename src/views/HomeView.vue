<template>
  <current-schedule-panel :items="schedule" />
  <full-schedule-panel :items="schedule" :show-past="showPast" />
</template>

<script setup lang="ts">
import CurrentSchedulePanel from "@/components/CurrentSchedulePanel.vue";
import FullSchedulePanel from "@/components/FullSchedulePanel.vue";
import { computed } from "vue";
import { useSettingsStore } from "@/stores/settings";
import { useScheduleStore } from "@/stores/schedule";

const scheduleStore = useScheduleStore();
const settingsStore = useSettingsStore();
const schedule = computed(() => scheduleStore.schedule);
const showPast = computed(() => settingsStore.showPastInList);
</script>
