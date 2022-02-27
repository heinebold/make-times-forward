<template>
  <section class="current">
    <schedule-card v-if="previousItem" class="previous">
      <schedule-item v-bind="previousItem" />
    </schedule-card>
    <schedule-card v-if="currentItem" class="current">
      <schedule-item v-bind="currentItem" />
    </schedule-card>
    <schedule-card v-if="nextItem" class="next">
      <schedule-item v-bind="nextItem" />
    </schedule-card>
  </section>
</template>

<script lang="ts">
import ScheduleCard from "@/components/ScheduleCard.vue";
import type { TimeSlot } from "@/model/TimeSlot";
import { mapState } from "vuex";
import ScheduleItem from "@/components/ScheduleItem.vue";
export default {
  name: "CurrentSchedulePanel",
  components: { ScheduleItem, ScheduleCard },
  props: {
    items: Array,
  },
  computed: {
    sortedItems(): Array<TimeSlot> {
      return [...this.items].sort((t1: TimeSlot, t2: TimeSlot) => {
        console.log(t1);
        console.log(t2);
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
section.current {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
}

section.current {
  width: 44vmax;
  height: 44vmax;
}
.current {
  font-size: 2.5vmax;
}
.previous {
  font-size: 1.4vmax;
}
.next {
  font-size: 1.9vmax;
}

@media (min-aspect-ratio: 2/1), (max-aspect-ratio: 1/2) {
  section.current {
    width: 88vmin;
    height: 88vmin;
  }
  .current {
    font-size: 5vmin;
  }
  .previous {
    font-size: 2.8vmin;
  }
  .next {
    font-size: 3.8vmin;
  }
}

.previous > * {
  filter: saturate(0) opacity(0.5) blur(0.03em);
}

.next > * {
  filter: opacity(0.66);
}
</style>
