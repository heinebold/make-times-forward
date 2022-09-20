<template>
  <div class="schedule-item" :title="title">
    <text-clamp class="title" :text="title" :max-lines="2" />
    <div class="main">
      <duration-info class="duration-info" :start="start" :end="end" />
      <div class="countdown">
        <countdown-clock
          v-if="hasStarted"
          :to="end"
          :from="appTime"
          show-plus
        />
        <countdown-clock v-else :to="start" :from="appTime" prefix="→" />
      </div>
    </div>
    <elapsed-seconds-meter
      v-if="hasStarted && !hasEnded"
      :duration="durationSeconds"
      :elapsed="elapsedSeconds"
    />
  </div>
</template>

<script setup lang="ts">
import type { Dayjs } from "dayjs";
import TextClamp from "vue3-text-clamp";
import CountdownClock from "@/components/CountdownClock.vue";
import ElapsedSecondsMeter from "@/components/ElapsedSecondsMeter.vue";
import DurationInfo from "@/components/DurationInfo.vue";
import { computed } from "vue";
import { useClock } from "@/composables/clock";

const appTime = useClock();
const props = defineProps<{ start: Dayjs; end: Dayjs; title: string }>();

const durationSeconds = computed(() => props.end.diff(props.start, "seconds"));
const elapsedSeconds = computed(() =>
  appTime.value.diff(props.start, "seconds")
);
const hasStarted = computed(
  () => !appTime.value.isBefore(props.start, "second")
);
const hasEnded = computed(() => appTime.value.isAfter(props.end, "second"));
</script>

<style scoped>
div {
  /*white-space: nowrap;*/
  overflow: hidden;
}

div.schedule-item {
  display: flex;
  flex-direction: column;
  gap: 0.4em;
  justify-content: space-between;
  text-align: center;
}

div.countdown {
  font-size: 120%;
}
.title {
  font-size: 100%;
  line-height: 1.2em;
  margin-bottom: 0.33em;
}

.duration-info {
  font-size: 66.67%;
}

div.main {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap-reverse;
}

meter {
  width: 100%;
}
</style>
