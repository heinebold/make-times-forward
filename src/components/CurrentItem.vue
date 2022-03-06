<template>
  <div class="schedule-item">
    <div class="title" :title="title">{{ title }}</div>
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
      v-if="hasStarted"
      :duration="durationSeconds"
      :elapsed="elapsedSeconds"
    />
  </div>
</template>

<!--
  The strange "-0.01" minimum on the meter is a hack for webkit/chromium browsers:
    For max = min ≤ value, Firefox shows a full meter, but Chromium an empty one.
    I want the full bar for 0-Minute-Events, and this way, there'll be min < max also if max=0,
    while not showing any visible difference to min=0
-->

<script lang="ts">
import TextClock from "@/components/TextClock.vue";
import { mapState } from "vuex";
import dayjs, { Dayjs } from "dayjs";
import CountdownClock from "@/components/CountdownClock.vue";
import ElapsedSecondsMeter from "@/components/ElapsedSecondsMeter.vue";
import DurationInfo from "@/components/DurationInfo.vue";

export default {
  name: "CurrentItem",
  components: { DurationInfo, ElapsedSecondsMeter, CountdownClock, TextClock },
  props: {
    start: dayjs,
    end: dayjs,
    title: String,
  },
  computed: {
    durationSeconds(): number {
      return (this.end as Dayjs).diff(this.start as Dayjs, "seconds");
    },
    elapsedSeconds(): number {
      return (this.appTime as Dayjs).diff(this.start as Dayjs, "seconds");
    },
    hasStarted(): boolean {
      return !(this.appTime as Dayjs).isBefore(this.start as Dayjs, "second");
    },
    ...mapState({ appTime: "time" }),
  },
};
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
div.title {
  font-size: 100%;
  text-overflow: ellipsis;
  line-height: 1.2em;
  max-height: 2.4em;
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
