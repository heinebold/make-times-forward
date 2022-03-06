<template>
  <section class="schedule-container">
    <h2>Schedule</h2>
    <div class="schedule-list">
      <schedule-card
        v-for="(item, index) in items"
        :key="index"
        class="previous"
      >
        <schedule-item v-bind="item" />
      </schedule-card>
    </div>
  </section>
</template>

<script lang="ts">
import ScheduleCard from "@/components/ScheduleCard.vue";
import ScheduleItem from "@/components/ScheduleItem.vue";
import type { TimeSlot } from "@/model/TimeSlot";
import { mapState } from "vuex";

export default {
  name: "FullSchedulePanel",
  components: { ScheduleItem, ScheduleCard },
  props: {
    items: Array,
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
.schedule-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden auto;

  width: 44vmax;
  height: 44vmax;
  font-size: 2vmax;
}

.schedule-container h2 {
  font-size: 100%;
}

@media (min-aspect-ratio: 2/1), (max-aspect-ratio: 1/2) {
  .schedule-container {
    width: 88vmin;
    height: 88vmin;
    font-size: 4vmin;
  }
}
</style>
