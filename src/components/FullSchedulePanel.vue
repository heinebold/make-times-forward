<template>
  <div class="schedule-list" :class="{ interactive: isInteractive }">
    <template v-for="(item, index) in enhancedItems" :key="item.id">
      <schedule-card
        class="schedule-entry"
        v-if="showPast || item.end.isAfter(appTime, 'minute')"
        :class="{ selected: item.id === selected }"
        :style="{ marginBottom: pauseMargin(item.pause) }"
        :tabindex="isInteractive ? 0 : undefined"
        @click="select(item.id)"
        @keydown.space="select(item.id)"
        @keydown.enter="select(item.id)"
      >
        <label v-if="numbered">{{ index }}</label>
        <schedule-item v-bind="item" />
      </schedule-card>
    </template>
  </div>
</template>

<script lang="ts">
import ScheduleCard from "@/components/ScheduleCard.vue";
import ScheduleItem from "@/components/ScheduleItem.vue";
import type { TimeSlot } from "@/model/TimeSlot";
import { defineComponent } from "vue";
import { useClock } from "@/composables/clock";
import type { Schedule } from "@/model/Schedule";

export default defineComponent({
  name: "FullSchedulePanel",
  components: { ScheduleItem, ScheduleCard },
  props: {
    items: Array,
    selected: String,
    numbered: Boolean,
    showPast: { type: Boolean, default: true },
  },
  setup() {
    return { appTime: useClock() };
  },
  computed: {
    isInteractive(): boolean {
      return !!this.$attrs["onUpdate:selected"];
    },
    durationSum(): number {
      return this.items?.length
        ? (this.items as Schedule)
            .map((t) => Math.abs(t.end.diff(t.start, "minutes")))
            .reduce(
              (previousValue, currentValue) => previousValue + currentValue
            )
        : 1;
    },
    enhancedItems(): Array<TimeSlot & { pause: number }> {
      if (!this.items) {
        return [];
      }
      const result = [];
      for (let itemIndex = 0; itemIndex < this.items.length; itemIndex++) {
        const item = this.items[itemIndex] as TimeSlot;
        const successor = this.items[itemIndex + 1] as TimeSlot;
        result.push({
          ...item,
          pause: this.pause(item, successor),
        });
      }
      return result;
    },
  },
  methods: {
    select(id: string) {
      this.$emit("update:selected", id === this.selected ? "" : id);
    },
    pause(item: TimeSlot, successor?: TimeSlot) {
      if (!this.durationSum) {
        return 0.015;
      }
      const pauseMinutes = successor?.start.isAfter(item.end)
        ? successor.start.diff(item.end, "minutes")
        : 0;
      return pauseMinutes / this.durationSum;
    },
    pauseMargin: (pause: number) =>
      pause ? `${Math.min(8 * pause, 2.5) + 0.4}em` : 0,
  },
});
</script>

<style scoped>
.schedule-entry {
  display: flex;
  align-items: center;
  gap: 0.5em;
}
.schedule-entry > * {
  flex: 1;
}
.schedule-entry > label {
  flex: 0 1 min-content;
}
.schedule-entry label {
  font-size: 70%;
  font-style: italic;
}

.schedule-entry.selected {
  background-color: var(--color-accent-bg);
}
.interactive .schedule-entry:not(.selected):hover {
  background-color: var(--color-background-mute);
}
.interactive .schedule-entry.selected:hover {
  color: var(--color-accent-fg);
}
</style>
