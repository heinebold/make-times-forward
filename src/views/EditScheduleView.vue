<template>
  <main-square class="edit-section">
    <schedule-card class="selected-item">
      <label>Title <input v-model="title" type="text" /></label>
      <label>Start <input v-model="start" type="datetime-local" /></label>
      <label>End <input v-model="end" type="datetime-local" /></label>
    </schedule-card>

    <div>
      <template v-if="selectedIndex < 0">
        <button @click="addItem">Add</button>
      </template>
      <template v-else>
        <button @click="updateItem(selectedIndex)">Update</button>
        <button @click="deleteItem(selectedIndex)">
          Delete #{{ selectedIndex }}
        </button>
      </template>
    </div>
  </main-square>

  <full-schedule-panel
    numbered
    :items="schedule"
    :selected="selectedIndex"
    @select-item="selectItem"
  />
</template>

<script setup lang="ts">
import FullSchedulePanel from "@/components/FullSchedulePanel.vue";
import type { Ref } from "vue";
import { computed, ref } from "vue";
import ScheduleCard from "@/components/ScheduleCard.vue";
import MainSquare from "@/components/MainSquare.vue";
import type { TimeSlot } from "@/model/TimeSlot";
import dayjs from "dayjs";
import { useScheduleStore } from "@/stores/schedule";

const scheduleStore = useScheduleStore();
const schedule = computed(() => scheduleStore.schedule);

const selectedIndex: Ref<number> = ref(-1);

const title: Ref<string> = ref("");
const start: Ref<string | undefined> = ref(undefined);
const end: Ref<string | undefined> = ref(undefined);

function selectItem(index: number) {
  selectedIndex.value = index === selectedIndex.value ? -1 : index;
  if (selectedIndex.value >= 0) {
    title.value = schedule.value[selectedIndex.value].title;
    start.value =
      schedule.value[selectedIndex.value].start.format("YYYY-MM-DDTHH:mm");
    end.value =
      schedule.value[selectedIndex.value].end.format("YYYY-MM-DDTHH:mm");
  }
}

function updateItem(index: number) {
  const newItem: TimeSlot = {
    title: title.value,
    start: dayjs(start.value),
    end: dayjs(end.value || start.value),
  };
  scheduleStore.updateScheduleItem({ index, newItem });
}
function addItem() {
  const newItem: TimeSlot = {
    title: title.value,
    start: dayjs(start.value),
    end: dayjs(end.value || start.value),
  };
  scheduleStore.addScheduleItem(newItem);
}
function deleteItem(index: number) {
  scheduleStore.deleteScheduleItem(index);
  if (selectedIndex.value >= schedule.value.length) {
    selectItem(selectedIndex.value);
  }
}
</script>

<style scoped>
.edit-section {
  --edit-font-size: 2.5vmax;
}
@media (min-aspect-ratio: 2/1), (max-aspect-ratio: 1/2) {
  .edit-section {
    --edit-font-size: 5vmin;
  }
}

.edit-section {
  justify-content: space-evenly;
}
.selected-item {
  display: flex;
  flex-direction: column;
  font-size: var(--edit-font-size);
}
.selected-item label {
  display: flex;
  justify-content: space-between;
  font-size: var(--edit-font-size);
}
.selected-item label input {
  width: 14em;
  max-width: 14em;
  font-size: var(--edit-font-size);
}
</style>
