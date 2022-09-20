<template>
  <div class="schedule-item">
    <div class="title" :title="title">{{ title }}</div>
    <duration-info class="info" :start="start" :end="end" />
  </div>
</template>

<script lang="ts">
import dayjs from "dayjs";
import DurationInfo from "@/components/DurationInfo.vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "ScheduleItem",
  components: { DurationInfo },
  props: {
    start: { type: dayjs, required: true },
    end: { type: dayjs, required: true },
    title: String,
  },
});
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

div.title {
  font-size: 66%;
  text-overflow: ellipsis;
  line-height: 1.2em;
  max-height: 2.4em;
}

.info {
  font-size: 50%;
  text-align: center;
  flex-shrink: 0;
}
</style>
