<template>
  <p>
    <label
      ><input type="checkbox" v-model="use12hSetting" /> Use 12h Time</label
    >
  </p>
  <p>
    <label
      ><input type="checkbox" v-model="alwaysTodaySetting" /> Ignore dates and
      always assume today</label
    >
    <br /><small
      >This only yields satisfying results for schedules that span ≤24h</small
    >
  </p>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useSettingsStore } from "@/stores/settings";

const store = useSettingsStore();
const use12hSetting = computed({
  get: () => store.use12hTime,
  set: store.set12hTime,
});
const alwaysTodaySetting = computed({
  get: () => store.alwaysToday,
  set: store.setAlwaysToday,
});
</script>
