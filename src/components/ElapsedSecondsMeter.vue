<template>
  <meter
    :value="Math.min(elapsed, duration)"
    min="-0.01"
    :max="duration"
    optimum="0"
    :low="greenYellowBoundary"
    :high="yellowRedBoundary"
  />
</template>
<!--
  The strange "-0.01" minimum is a hack for webkit/chromium browsers:
    For max = min ≤ value, Firefox shows a full meter, but Chromium an empty one.
    I want the full bar for 0-Minute-Events, and this way, there'll be min < max also if max=0,
    while not showing any visible difference to min=0
-->

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ElapsedSecondsMeter",
  props: {
    duration: { type: Number, required: true },
    elapsed: { type: Number, required: true },
  },
  computed: {
    greenYellowBoundary(): number {
      const minutes = this.duration / 60;
      return Math.max(
        45,
        60 * Math.min(Math.floor(minutes * 0.9), minutes - 1)
      );
    },
    yellowRedBoundary(): number {
      return Math.max(this.greenYellowBoundary + 1, this.duration - 5);
    },
  },
});
</script>

<style scoped></style>
