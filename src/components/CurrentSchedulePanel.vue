<template>
  <schedule-card class="previous" :class="{ placeholder: !previousItem }">
    <current-item v-if="previousItem" v-bind="previousItem" />
  </schedule-card>

  <schedule-card class="current" :class="{ placeholder: !scheduleIsOngoing }">
    <current-item v-if="currentItem" v-bind="currentItem" />
    <progress
      v-else-if="scheduleIsOngoing"
      :max="nextItem.start.diff(previousItem.end, 'seconds')"
      :value="appTime.diff(previousItem.end, 'seconds')"
    />
  </schedule-card>

  <schedule-card class="next" :class="{ placeholder: !nextItem }">
    <current-item v-if="nextItem" v-bind="nextItem" />
  </schedule-card>
</template>

<script lang="ts">
import ScheduleCard from "@/components/ScheduleCard.vue";
import type { TimeSlot } from "@/model/TimeSlot";
import { mapState } from "pinia";
import CurrentItem from "@/components/CurrentItem.vue";
import { defineComponent } from "vue";
import { useSettingsStore } from "@/stores/settings";
import { useClock } from "@/composables/clock";
import { useSound } from "@/composables/sound";
import type { Schedule } from "@/model/Schedule";

export default defineComponent({
  name: "CurrentSchedulePanel",
  components: { CurrentItem, ScheduleCard },
  props: {
    items: Array,
  },
  setup() {
    return {
      appTime: useClock(),
      dingDongSound: useSound(),
    };
  },
  computed: {
    sortedItems(): Schedule {
      // TODO properly type the prop and remove this, now that it's not needed for sorting anymore
      return (this.items ?? []) as Schedule;
    },
    firstNonPastIndex(): number {
      const foundIndex = this.sortedItems.findIndex((item: TimeSlot) =>
        item.end.isAfter(this.appTime, "minute")
      );
      return foundIndex < 0 ? this.sortedItems.length : foundIndex;
    },
    currentItem(): TimeSlot | undefined {
      const firstNonPastItem = this.sortedItems[this.firstNonPastIndex];
      // If the first non-past item is in the future, it is not actually a current item, so we return undefined - unless
      // it is the first item of the schedule, which is to be shown in the center
      return firstNonPastItem?.start.isAfter(this.appTime, "minute") &&
        this.previousItem
        ? undefined
        : firstNonPastItem;
    },
    previousItem(): TimeSlot | undefined {
      return this.sortedItems[this.firstNonPastIndex - 1];
    },
    nextItem(): TimeSlot | undefined {
      return this.currentItem
        ? this.sortedItems[this.firstNonPastIndex + 1]
        : this.sortedItems[this.firstNonPastIndex];
    },
    scheduleIsOngoing(): boolean {
      return !!(this.currentItem || (this.nextItem && this.previousItem));
    },
    ...mapState(useSettingsStore, ["playSounds"]),
  },
  watch: {
    currentItem() {
      this.dingdong();
    },
  },
  methods: {
    dingdong() {
      if (this.playSounds) {
        this.dingDongSound.play();
      }
    },
  },
});
</script>

<style scoped>
.current {
  font-family: "DejaVu Sans", serif;
  font-size: 2.5vmax;
  font-weight: bold;
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

progress {
  width: 100%;
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
  /*filter: opacity(0.66);*/
}
</style>
