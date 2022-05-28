<template>
  <main-square>
    <h2>Schedule</h2>
    <div class="schedule-list">
      <template v-for="(item, index) in enhancedItems" :key="index">
        <schedule-card
          v-if="showPast || item.end.isAfter(appTime, 'minute')"
          :class="selected === index ? 'selected' : ''"
          @click="$emit('select-item', index)"
          :style="{
            marginBottom: '' + Math.min(10 * item.pause + 0.2, 2.4) + 'em',
          }"
        >
          <i v-if="numbered">{{ index }} </i>
          <schedule-item v-bind="item" />
        </schedule-card>
      </template>
    </div>
  </main-square>
</template>

<script lang="ts">
import ScheduleCard from "@/components/ScheduleCard.vue";
import ScheduleItem from "@/components/ScheduleItem.vue";
import type { TimeSlot } from "@/model/TimeSlot";
import { mapState } from "pinia";
import MainSquare from "@/components/MainSquare.vue";
import { defineComponent } from "vue";
import { useClockStore } from "@/stores/clock";

export default defineComponent({
  name: "FullSchedulePanel",
  components: { MainSquare, ScheduleItem, ScheduleCard },
  props: {
    items: Array,
    selected: Number,
    numbered: Boolean,
    showPast: { type: Boolean, default: true },
  },
  computed: {
    durationSum(): number {
      return this.items?.length
        ? (this.items as TimeSlot[])
            .map((t) => t.end.diff(t.start, "minutes"))
            .reduce(
              (previousValue, currentValue) => previousValue + currentValue
            )
        : 1;
    },
    enhancedItems(): Array<TimeSlot & { pause: number }> {
      if (!this.items) {
        return [];
      }
      let result = [];
      for (let itemIndex = 0; itemIndex < this.items.length; itemIndex++) {
        const item = this.items[itemIndex] as TimeSlot;
        const successor = this.items[itemIndex + 1] as TimeSlot;
        const pauseMinutes = successor?.start.isAfter(item.end)
          ? successor.start.diff(item.end, "minutes")
          : 0;
        const pause = pauseMinutes ? pauseMinutes / this.durationSum + 0.04 : 0;
        result.push({
          ...item,
          pause,
        });
      }
      return result;
    },

    ...mapState(useClockStore, { appTime: "time" }),
  },
});
</script>

<style scoped>
h2 {
  font-size: 100%;
}

.schedule-card {
  display: flex;
  align-items: center;
}
.schedule-card > * {
  flex-grow: 1;
}
i {
  font-size: 70%;
}

.selected {
  background-color: var(--color-accent-bg);
}
</style>
