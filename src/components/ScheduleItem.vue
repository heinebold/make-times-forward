<template>
  <div class="schedule-item" :title="title">
    <text-clamp class="title" :text="title" :max-lines="2" />
    <duration-info class="info" :start="start" :end="end" />
  </div>
</template>

<script setup lang="ts">
import type { Dayjs } from "dayjs";
import TextClamp from "vue3-text-clamp";
import DurationInfo from "@/components/DurationInfo.vue";

defineProps<{ start: Dayjs; end: Dayjs; title: string }>();
</script>

<style scoped>
div {
  overflow: hidden;
}

div.schedule-item {
  display: flex;
  gap: 0.4em;
  justify-content: space-between;
  align-items: center;
}

.title {
  font-size: 66%;
  line-height: 1.2em;
}

.info {
  font-size: 50%;
  text-align: center;
  flex-shrink: 0;
}
</style>
