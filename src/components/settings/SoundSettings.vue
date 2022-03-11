<template>
  <p>
    <label><input type="checkbox" v-model="playSounds" /> Play Sounds</label>
  </p>
</template>

<script setup lang="ts">
import { useStore } from "@/store";
import { computed } from "vue";

const store = useStore();
const playSounds = computed({
  get: () => store.state.playSounds,
  set: (newValue: boolean) => store.commit("setPlaySounds", newValue),
});
</script>
