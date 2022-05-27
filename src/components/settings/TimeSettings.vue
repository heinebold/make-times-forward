<template>
  <p>
    <label
      ><input type="checkbox" v-model="use12hSetting" /> Use 12h Time</label
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
</script>
