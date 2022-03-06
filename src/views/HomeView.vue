<template>
  <current-schedule-panel :items="schedule" />
  <full-schedule-panel :items="schedule" />
</template>

<script setup lang="ts">
import CurrentSchedulePanel from "@/components/CurrentSchedulePanel.vue";
import FullSchedulePanel from "@/components/FullSchedulePanel.vue";
import { useStore } from "@/store";
import { computed } from "vue";

const store = useStore();
const schedule = computed(() => store.state.schedule);
</script>
