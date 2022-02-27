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

<script lang="ts">
export default {
  name: "ElapsedSecondsMeter",
  props: {
    duration: Number,
    elapsed: Number,
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
};
</script>

<style scoped></style>
