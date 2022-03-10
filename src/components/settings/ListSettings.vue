<template>
  <p>
    <label
      ><input type="checkbox" v-model="showPastInList" /> Show past items in
      Schedule</label
    >
  </p>
</template>

<script setup lang="ts">
import { useStore } from "@/store";
import { computed } from "vue";

const store = useStore();
const showPastInList = computed({
  get: () => store.state.showPastInList,
  set: (newValue: boolean) => store.commit("setShowPastInList", newValue),
});
</script>
