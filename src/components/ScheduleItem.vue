<template>
  <div class="schedule-item">
    <div class="title" :title="title">{{ title }}</div>
    <div class="info">
      <div class="schedule">
        <text-clock :time="start" /><template v-if="durationMinutes"
          >→<text-clock :time="end"
        /></template>
      </div>
      <div v-if="durationMinutes">{{ durationMinutes }} min</div>
    </div>
  </div>
</template>

<script lang="ts">
import TextClock from "@/components/TextClock.vue";
import dayjs, { Dayjs } from "dayjs";

export default {
  name: "ScheduleItem",
  components: { TextClock },
  props: {
    start: dayjs,
    end: dayjs,
    title: String,
  },
  computed: {
    durationMinutes(): number {
      return (this.end as Dayjs).diff(this.start as Dayjs, "minutes");
    },
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
div.info {
  font-size: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 7em;
}

div.schedule {
  display: flex;
  gap: 0.33em;
}
</style>
