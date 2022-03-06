<template>
  <div class="schedule-item">
    <div class="title" :title="title">{{ title }}</div>
    <duration-info class="info" :start="start" :end="end" />
  </div>
</template>

<script lang="ts">
import dayjs, { Dayjs } from "dayjs";
import DurationInfo from "@/components/DurationInfo.vue";

export default {
  name: "ScheduleItem",
  components: { DurationInfo },
  props: {
    start: dayjs,
    end: dayjs,
    title: String,
  },
};
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
  width: 7em;
  text-align: center;
}
</style>
