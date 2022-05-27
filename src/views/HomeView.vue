<template>
  <current-schedule-panel :items="schedule" />
  <full-schedule-panel :items="schedule" :show-past="showPast" />
</template>

<script setup lang="ts">
import CurrentSchedulePanel from "@/components/CurrentSchedulePanel.vue";
import FullSchedulePanel from "@/components/FullSchedulePanel.vue";
import { useStore } from "@/store";
import { computed } from "vue";
import { useSettingsStore } from "@/stores/settings";

const store = useStore();
const settingsStore = useSettingsStore();
const schedule = computed(() => store.state.schedule);
const showPast = computed(() => settingsStore.showPastInList);
</script>
