<template>
  <main-square>
    <schedule-card class="previous" :class="previousItem ? '' : 'placeholder'">
      <current-item v-if="previousItem" v-bind="previousItem" />
    </schedule-card>
    <schedule-card class="current" :class="currentItem ? '' : 'placeholder'">
      <current-item v-if="currentItem" v-bind="currentItem" />
    </schedule-card>
    <schedule-card class="next" :class="nextItem ? '' : 'placeholder'">
      <current-item v-if="nextItem" v-bind="nextItem" />
    </schedule-card>
  </main-square>
</template>

<script lang="ts">
import ScheduleCard from "@/components/ScheduleCard.vue";
import type { TimeSlot } from "@/model/TimeSlot";
import { mapState } from "vuex";
import CurrentItem from "@/components/CurrentItem.vue";
import MainSquare from "@/components/MainSquare.vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "CurrentSchedulePanel",
  components: { MainSquare, CurrentItem, ScheduleCard },
  props: {
    items: Array,
  },
  computed: {
    sortedItems(): Array<TimeSlot> {
      return [...(this.items as TimeSlot[])].sort(
        (t1: TimeSlot, t2: TimeSlot) => {
          return t1.start.diff(t2.start, "minutes");
        }
      );
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
});
</script>

<style scoped>
.main-square {
  justify-content: space-evenly;
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

.placeholder {
  visibility: hidden;
  min-height: 4em;
}

@media (min-aspect-ratio: 2/1), (max-aspect-ratio: 1/2) {
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
