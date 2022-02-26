<template>
  <div class="textclock">{{ displayTime }}</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import dayjs from "dayjs";

export default defineComponent({
  name: "TextClock",
  props: {
    baseTime: dayjs,
    offsetSeconds: Number,
    includeSeconds: Boolean,
  },
  data() {
    return {
      format: this.includeSeconds ? "HH:mm:ss" : "HH:mm",
    };
  },
  computed: {
    displayTime(): string {
      return (this.baseTime || dayjs(Date.UTC(0, 0, 0, -1)))
        .add((this.offsetSeconds || 0) * 1000)
        .format(this.format);
    },
  },
});
</script>

<style scoped></style>
