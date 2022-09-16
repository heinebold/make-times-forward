<template>
  <main-square class="edit-section">
    <schedule-card class="selected-item">
      <edit-item v-model:model-value="currentItem" />
    </schedule-card>

    <schedule-card class="button-panel">
      <template v-if="selectedId">
        <button :disabled="!currentItem?.title" @click="updateItem">
          Update
        </button>
        <button @click="deleteItem">Delete #{{ currentIndex }}</button>
      </template>
      <button :disabled="!currentItem?.title" @click="addItem">
        {{ selectedId ? "Copy" : "Add" }}
      </button>
    </schedule-card>

    <schedule-card class="file-area">
      <h3>File Import/Export</h3>
      <div>
        <file-selector @import-file="importFile" />
      </div>
      <div>
        <button @click="exportFile">Export</button>
      </div>
    </schedule-card>
  </main-square>
  <main-square>
    <h2>Schedule</h2>
    <full-schedule-panel
      numbered
      :items="schedule"
      v-model:selected="selectedId"
    />
  </main-square>
</template>

<script setup lang="ts">
import FullSchedulePanel from "@/components/FullSchedulePanel.vue";
import type { Ref } from "vue";
import { computed, ref, watch } from "vue";
import ScheduleCard from "@/components/ScheduleCard.vue";
import MainSquare from "@/components/MainSquare.vue";
import type { TimeSlot } from "@/model/TimeSlot";
import { useScheduleStore } from "@/stores/schedule";
import EditItem from "@/components/EditItem.vue";
import FileSelector from "@/components/FileSelector.vue";
import { saveAs } from "file-saver";
import { stringifySchedule } from "@/model/TimeSlot";

const scheduleStore = useScheduleStore();
const schedule = computed(() => scheduleStore.schedule);
const selectedId = ref("");
const currentItem: Ref<TimeSlot | undefined> = ref(undefined);
const currentIndex = computed(() =>
  schedule.value.findIndex((t) => t.id === selectedId.value)
);

watch(currentIndex, (newIndex) => {
  if (newIndex >= 0) {
    currentItem.value = schedule.value[newIndex];
  } else {
    if (currentItem.value) {
      currentItem.value = { ...currentItem.value, id: "" };
    }
    if (selectedId.value.length) {
      selectedId.value = "";
    }
  }
});

function updateItem() {
  if (currentItem.value) {
    scheduleStore.updateScheduleItem(currentItem.value);
  }
}
function addItem() {
  if (currentItem.value) {
    scheduleStore.addScheduleItem(currentItem.value);
  }
}
function deleteItem() {
  const selectedIndex = currentIndex.value;
  scheduleStore.deleteScheduleItem(selectedId.value);
  selectedId.value = schedule.value[selectedIndex]?.id ?? "";
}

function importFile(data: TimeSlot[]) {
  scheduleStore.replaceSchedule(data);
}

function exportFile() {
  const data = new Blob([stringifySchedule(schedule.value, 2)], {
    type: "text/json",
  });
  saveAs(data, "schedule.json");
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
.button-panel {
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  gap: 1em;
  padding: 0.5em 2em;
}
.file-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  justify-content: center;
  gap: 1em;
}

h3 {
  font-size: 80%;
}

.selected-item {
  display: flex;
  flex-direction: column;
  font-size: var(--edit-font-size);
}
</style>
