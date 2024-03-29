<template>
  <TextClock
    :use12h="false"
    :include-seconds="includeSeconds"
    :time="time"
    :prefix="clockPrefix"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import dayjs, { Dayjs } from "dayjs";
import TextClock from "@/components/TextClock.vue";

type Precision = "minutes" | "seconds";
const date0 = dayjs("1970-01-01T00:00:00");

function countdown(from: Dayjs, to: Dayjs, precision: Precision): Dayjs {
  const normalizedFrom = from.startOf(precision);
  const normalizedTo = to.startOf(precision);
  const diff = normalizedTo.diff(normalizedFrom, precision);
  return date0.add(diff, precision);
}

const signPlaceholder = " ";

export default defineComponent({
  name: "CountdownClock",
  components: { TextClock },

  props: {
    from: { type: Dayjs, required: true },
    to: { type: Dayjs, required: true },
    includeSeconds: Boolean,
    showMinus: Boolean,
    showPlus: Boolean,
    prefix: String,
  },
  computed: {
    precision(): Precision {
      return this.includeSeconds ? "seconds" : "minutes";
    },
    countingBackwards(): boolean {
      return this.to.isBefore(this.from, this.precision);
    },
    atEvenPoint(): boolean {
      return this.to.isSame(this.from, this.precision);
    },
    time(): Dayjs {
      return this.countingBackwards
        ? countdown(this.to, this.from, this.precision)
        : countdown(this.from, this.to, this.precision);
    },
    sign(): string {
      if (!(this.showMinus || this.showPlus)) {
        return "";
      }
      if (this.atEvenPoint) {
        return signPlaceholder;
      }
      if (this.countingBackwards) {
        return this.showPlus ? "+ " : signPlaceholder;
      }
      return this.showMinus ? "− " : signPlaceholder;
    },
    clockPrefix(): string {
      return (this.prefix || "") + this.sign;
    },
  },
});
</script>

<style scoped></style>
