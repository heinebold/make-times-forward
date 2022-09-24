<template>
  <p>
    <label
      ><input type="checkbox" v-model="headerAsFooter" /> Move main menu to the
      bottom</label
    >
  </p>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useSettingsStore } from "@/stores/settings";

const store = useSettingsStore();
const headerAsFooter = computed({
  get: () => store.headerAsFooter,
  set: store.setHeaderAsFooter,
});
</script>
