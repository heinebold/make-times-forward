<template>
  <div class="textclock">{{ prefix }}{{ displayTime }}</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Dayjs } from "dayjs";

export default defineComponent({
  name: "TextClock",
  props: {
    time: { type: Dayjs, required: true },
    includeSeconds: Boolean,
    use12h: Boolean,
    prefix: String,
  },
  computed: {
    format(): string {
      if (this.use12h) {
        return this.includeSeconds ? "hh:mm:ss a" : "hh:mm a";
      } else {
        return this.includeSeconds ? "HH:mm:ss" : "HH:mm";
      }
    },
    displayTime(): string {
      return this.time.format(this.format);
    },
  },
});
</script>

<style scoped></style>
