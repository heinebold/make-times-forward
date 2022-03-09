<template>
  <div class="textclock">{{ prefix }}{{ displayTime }}</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import dayjs, { Dayjs } from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
dayjs.extend(localizedFormat);

export default defineComponent({
  name: "TextClock",
  props: {
    time: { type: Dayjs, required: true },
    includeSeconds: Boolean,
    prefix: String,
  },
  computed: {
    format(): string {
      return this.includeSeconds ? "LTS" : "LT";
    },
    displayTime(): string {
      return this.time.format(this.format);
    },
  },
});
</script>

<style scoped></style>
