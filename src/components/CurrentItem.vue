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

<script lang="ts">
import dayjs, { Dayjs } from "dayjs";
import CountdownClock from "@/components/CountdownClock.vue";
import ElapsedSecondsMeter from "@/components/ElapsedSecondsMeter.vue";
import DurationInfo from "@/components/DurationInfo.vue";
import { defineComponent } from "vue";
import { useClock } from "@/composables/clock";

export default defineComponent({
  name: "CurrentItem",
  components: { DurationInfo, ElapsedSecondsMeter, CountdownClock },
  props: {
    start: { type: dayjs, required: true },
    end: { type: dayjs, required: true },
    title: String,
  },
  setup() {
    return { appTime: useClock() };
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
    // ...mapState(useClockStore, { appTime: "time" }),
  },
});
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
