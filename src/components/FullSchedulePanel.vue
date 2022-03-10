<template>
  <main-square>
    <h2>Schedule</h2>
    <div class="schedule-list">
      <template v-for="(item, index) in typedItems" :key="index">
        <schedule-card
          v-if="showPast || item.end.isAfter(appTime, 'minute')"
          :class="selected === index ? 'selected' : ''"
          @click="$emit('select-item', index)"
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
import { mapState } from "vuex";
import MainSquare from "@/components/MainSquare.vue";
import { defineComponent } from "vue";

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
    typedItems(): Array<TimeSlot> {
      return this.items as TimeSlot[];
    },

    ...mapState({ appTime: "time" }),
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
