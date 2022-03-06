<template>
  <main-square>
    <h2>Schedule</h2>
    <div class="schedule-list">
      <schedule-card
        v-for="(item, index) in items"
        :key="index"
        :class="selected === index ? 'selected' : ''"
        @click="$emit('select', index)"
      >
        <i v-if="numbered">{{ index }} </i>
        <schedule-item v-bind="item" />
      </schedule-card>
    </div>
  </main-square>
</template>

<script lang="ts">
import ScheduleCard from "@/components/ScheduleCard.vue";
import ScheduleItem from "@/components/ScheduleItem.vue";
import type { TimeSlot } from "@/model/TimeSlot";
import { mapState } from "vuex";
import MainSquare from "@/components/MainSquare.vue";

export default {
  name: "FullSchedulePanel",
  components: { MainSquare, ScheduleItem, ScheduleCard },
  props: {
    items: Array,
    selected: Number,
    numbered: Boolean,
  },
  computed: {
    sortedItems(): Array<TimeSlot> {
      return [...this.items].sort((t1: TimeSlot, t2: TimeSlot) => {
        return t1.start.diff(t2.start, "minutes");
      });
    },
    currentItemIndex(): number {
      const foundIndex = (
        this.sortedItems as unknown as Array<TimeSlot>
      ).findIndex(
        (item: TimeSlot) => !item.end.isBefore(this.appTime, "minute")
      );
      return foundIndex < 0 ? this.sortedItems.length : foundIndex;
    },
    currentItem(): TimeSlot | undefined {
      return this.sortedItems[this.currentItemIndex];
    },
    previousItem(): TimeSlot | undefined {
      return this.sortedItems[this.currentItemIndex - 1];
    },
    nextItem(): TimeSlot | undefined {
      return this.sortedItems[this.currentItemIndex + 1];
    },

    ...mapState({ appTime: "time" }),
  },
};
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
