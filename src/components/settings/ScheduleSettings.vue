<template>
  <p>
    <label
      ><input type="checkbox" v-model="showPastInList" /> Show past items in
      Schedule</label
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
const showPastInList = computed({
  get: () => store.showPastInList,
  set: store.setShowPastInList,
});
const alwaysTodaySetting = computed({
  get: () => store.alwaysToday,
  set: store.setAlwaysToday,
});
</script>
