<template>
  <p>
    <label><input type="checkbox" v-model="playSounds" /> Play Sounds</label>
  </p>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useSettingsStore } from "@/stores/settings";

const store = useSettingsStore();
const playSounds = computed({
  get: () => store.playSounds,
  set: store.setPlaySounds,
});
</script>
