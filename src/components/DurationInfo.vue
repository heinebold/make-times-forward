<template>
  <div class="duration-info">
    <div class="schedule">
      <text-clock :time="start" :use12h="use12hTime" /><template
        v-if="durationMinutes"
        >→<text-clock :time="end" :use12h="use12hTime"
      /></template>
    </div>
    <div v-if="durationMinutes">{{ durationMinutes }} min</div>
  </div>
</template>

<script lang="ts">
import TextClock from "@/components/TextClock.vue";
import dayjs, { Dayjs } from "dayjs";
import { mapState } from "vuex";

export default {
  name: "DurationInfo",
  components: { TextClock },
  props: {
    start: dayjs,
    end: dayjs,
  },
  computed: {
    durationMinutes(): number {
      return (this.end as Dayjs).diff(this.start as Dayjs, "minutes");
    },
    ...mapState(["use12hTime"]),
  },
};
</script>

<style scoped>
div.duration-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  line-height: 1em;
  gap: 0.6em;
  padding: 0.3em 0;
}

div.schedule {
  display: flex;
  gap: 0.33em;
}
</style>
