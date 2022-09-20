<template>
  <main-square class="current-schedule">
    <current-schedule-panel :items="schedule" />
  </main-square>
  <main-square>
    <h2>Schedule</h2>

    <full-schedule-panel :items="schedule" :show-past="showPast" />
  </main-square>
</template>

<script setup lang="ts">
import CurrentSchedulePanel from "@/components/CurrentSchedulePanel.vue";
import FullSchedulePanel from "@/components/FullSchedulePanel.vue";
import { computed, ref, watch } from "vue";
import { useSettingsStore } from "@/stores/settings";
import { useScheduleStore } from "@/stores/schedule";
import MainSquare from "@/components/MainSquare.vue";
import { useClock } from "@/composables/clock";
import type { Dayjs } from "dayjs";
import type { Schedule } from "@/model/Schedule";

const scheduleStore = useScheduleStore();
const settingsStore = useSettingsStore();
const appTime = useClock();
const showPast = computed(() => settingsStore.showPastInList);
const alwaysToday = computed(() => settingsStore.alwaysToday);

const today = ref(appTime.value.startOf("day"));
watch(
  () => appTime.value.startOf("day"),
  (newToday: Dayjs, oldToday: Dayjs) => {
    if (!newToday.isSame(oldToday, "date")) {
      today.value = newToday;
    }
  }
);

const schedule = computed(() =>
  alwaysToday.value
    ? adjustedSchedule(scheduleStore.schedule, today.value)
    : scheduleStore.schedule
);

function adjustedSchedule(schedule: Schedule, date: Dayjs): Schedule {
  if (schedule.length < 1) {
    return schedule;
  }
  const diff = date
    .subtract(1, "day")
    .diff(schedule[0].start.startOf("day"), "days");

  const result = schedule.map((item) => {
    const start = item.start.add(diff, "days");
    const end = item.end.add(diff, "days");
    const id = item.id;
    const title = item.title;
    return { id, title, start, end };
  });

  return result[result.length - 1].end.isBefore(appTime.value)
    ? adjustedSchedule(schedule, date.add(1, "day"))
    : result;
}
</script>

<style scoped>
.current-schedule {
  justify-content: space-evenly;
}
</style>
