<template>
  <main-square>
    <schedule-card class="previous" :class="{ placeholder: !previousItem }">
      <current-item v-if="previousItem" v-bind="previousItem" />
    </schedule-card>
    <schedule-card
      class="current"
      :class="{ placeholder: !(currentItem || (previousItem && nextItem)) }"
    >
      <current-item v-if="currentItem" v-bind="currentItem" />
      <progress
        v-else-if="previousItem && nextItem"
        :max="nextItem.start.diff(previousItem.end, 'seconds')"
        :value="appTime.diff(previousItem.end, 'seconds')"
      />
    </schedule-card>
    <schedule-card class="next" :class="{ placeholder: !nextItem }">
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

const dingDongSound = new Audio("/Single-ding-dong-tubular-bell.mp3");

export default defineComponent({
  name: "CurrentSchedulePanel",
  components: { MainSquare, CurrentItem, ScheduleCard },
  props: {
    items: Array,
  },
  data() {
    return {
      previousCurrentItem: null as TimeSlot | undefined | null,
    };
  },
  computed: {
    sortedItems(): Array<TimeSlot> {
      return [...(this.items as TimeSlot[])].sort(
        (t1: TimeSlot, t2: TimeSlot) => t1.start.diff(t2.start, "minutes")
      );
    },
    firstNonPastIndex(): number {
      const foundIndex = this.sortedItems.findIndex((item: TimeSlot) =>
        item.end.isAfter(this.appTime, "minute")
      );
      return foundIndex < 0 ? this.sortedItems.length : foundIndex;
    },
    currentItem(): TimeSlot | undefined {
      const currentItem = this.sortedItems[this.firstNonPastIndex];
      const actualResult = currentItem?.start.isAfter(this.appTime, "minute")
        ? this.previousItem
          ? undefined
          : currentItem
        : currentItem;

      if (actualResult !== this.previousCurrentItem) {
        this.previousCurrentItem === null || this.dingdong();
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.previousCurrentItem = actualResult;
      }

      return actualResult;
    },
    previousItem(): TimeSlot | undefined {
      return this.sortedItems[this.firstNonPastIndex - 1];
    },
    nextItem(): TimeSlot | undefined {
      return this.currentItem
        ? this.sortedItems[this.firstNonPastIndex + 1]
        : this.sortedItems[this.firstNonPastIndex];
    },

    ...mapState({ appTime: "time", playSounds: "playSounds" }),
  },
  methods: {
    dingdong() {
      this.playSounds && dingDongSound.play();
    },
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
