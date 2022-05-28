<template>
  <p>
    <label
      ><input type="checkbox" v-model="showPastInList" /> Show past items in
      Schedule</label
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
</script>
