<template>
  <div class="textclock">{{ displayTime }}</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import dayjs, { Dayjs } from "dayjs";

export default defineComponent({
  name: "TextClock",
  props: {
    baseTime: Dayjs,
    includeSeconds: Boolean,
    use12h: Boolean,
  },
  computed: {
    format(): string {
      if (this.use12h) {
        return this.includeSeconds ? "hh:mm:ss a" : "hh:mm a";
      } else {
        return this.includeSeconds ? "HH:mm:ss" : "HH:mm";
      }
    },
    time(): Dayjs {
      return this.baseTime || dayjs("0000-00-00T00:00:00.0");
    },
    displayTime(): string {
      return this.time.format(this.format);
    },
  },
});
</script>

<style scoped></style>
