<template>
  <p>
    <label
      ><input type="checkbox" v-model="use12hSetting" /> Use 12h Time</label
    >
  </p>
</template>

<script setup lang="ts">
import { useStore } from "@/store";
import { computed } from "vue";

const store = useStore();
const use12hSetting = computed({
  get: () => store.state.use12hTime,
  set: (newValue: boolean) => store.commit("set12hTime", newValue),
});
</script>
