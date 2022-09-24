<template>
  <main-square class="current-schedule">
    <current-schedule-panel :items="schedule" v-if="schedule.length" />
    <schedule-card class="empty-info" v-else
      ><h2>The current schedule is empty</h2>
      <p>
        Go to the <router-link to="edit-schedule">Edit Section</router-link> to
        add some items to your schedule or to import them from a file.
      </p></schedule-card
    >
  </main-square>
  <main-square v-if="schedule.length">
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
import ScheduleCard from "@/components/ScheduleCard.vue";

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

const scheduleToday = computed(() =>
  alwaysToday.value
    ? adjustedSchedule(scheduleStore.schedule, today.value)
    : scheduleStore.schedule
);
const scheduleYesterday = computed(() =>
  alwaysToday.value
    ? adjustedSchedule(scheduleStore.schedule, today.value.subtract(1, "day"))
    : scheduleStore.schedule
);

const schedule = computed(() =>
  scheduleYesterday.value[scheduleYesterday.value.length - 1]?.end.isBefore(
    appTime.value
  )
    ? scheduleToday.value
    : scheduleYesterday.value
);

function adjustedSchedule(schedule: Schedule, date: Dayjs): Schedule {
  if (schedule.length < 1) {
    return schedule;
  }
  const diff = date.diff(schedule[0]?.start.startOf("day"), "days");

  return schedule.map((item) => {
    const start = item.start.add(diff, "days");
    const end = item.end.add(diff, "days");
    const id = item.id;
    const title = item.title;
    return { id, title, start, end };
  });
}
</script>

<style scoped>
.current-schedule {
  justify-content: space-evenly;
}
.empty-info h2 {
  text-align: center;
}
.empty-info p {
  font-size: 66%;
  width: 90%;
  margin: auto;
}
</style>
