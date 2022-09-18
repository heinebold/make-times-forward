<template>
  <main-square class="edit-section">
    <schedule-card class="item-panel">
      <edit-item v-model:model-value="currentItem" />
      <div class="actions-panel">
        <template v-if="selectedId">
          <button :disabled="!currentItem?.title" @click="updateItem">
            Update
          </button>
          <button @click="deleteItem">Delete #{{ currentIndex }}</button>
        </template>
        <button :disabled="!currentItem?.title" @click="addItem">
          {{ selectedId ? "Copy" : "Add" }}
        </button>
      </div>
    </schedule-card>

    <schedule-card class="file-panel">
      <h3>File Import/Export</h3>
      <div class="actions-panel">
        <file-selector @import-file="importFile" />
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

    <confirmation-modal
      name="importDialog"
      v-model="showModal"
      :click-to-close="false"
      :esc-to-close="true"
      @confirm="confirmImport"
    >
      <template #title>Import JSON File</template>
      <template v-slot="{ params }">
        <main-square class="preview-area">
          <p v-if="params.text" class="modal-text">{{ params.text }}</p>
          <full-schedule-panel
            v-if="params.data"
            class="schedule-preview"
            :items="params.data"
            :numbered="true"
          />
        </main-square>
      </template>
      <template #cancel>❌ Cancel</template>
      <template #confirm>✅ Import</template>
    </confirmation-modal>
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
import { $vfm as vueFinalModal } from "vue-final-modal";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
import { parseSchedule, stringifySchedule } from "@/model/TimeSlot";

const scheduleStore = useScheduleStore();
const schedule = computed(() => scheduleStore.schedule);
const selectedId = ref("");
const currentItem: Ref<TimeSlot | undefined> = ref(undefined);
const currentIndex = computed(() =>
  schedule.value.findIndex((t) => t.id === selectedId.value)
);
const showModal = ref(false);

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

function importFile(file: File) {
  file
    ?.text()
    .then(parseSchedule)
    .then((schedule) =>
      vueFinalModal.show("importDialog", {
        text: "The following schedule can be imported:",
        data: schedule,
      })
    )
    .catch(() =>
      vueFinalModal.show("importDialog", {
        text: "The selected file does not contain valid schedule data.",
        canConfirm: false,
      })
    );
}

function confirmImport(params: { text: string; data: TimeSlot[] }) {
  scheduleStore.replaceSchedule(params.data as TimeSlot[]);
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
  --edit-font-size: 2vmax;
}
@media (min-aspect-ratio: 2/1), (max-aspect-ratio: 1/2) {
  .edit-section {
    --edit-font-size: 4vmin;
  }
}

.edit-section {
  justify-content: space-evenly;
}
.actions-panel {
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  gap: 1em;
  padding: 0.5em 2em;
}
.file-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  justify-content: center;
}

button {
  font-size: 67%;
  padding: 0.334em 0.667em;
  white-space: nowrap;
}

h3 {
  font-size: 80%;
}

.item-panel {
  display: flex;
  flex-direction: column;
  font-size: var(--edit-font-size);
}

.modal-text {
  font-size: 75%;
  margin-top: 1em;
}
.preview-area {
  height: max-content;
  padding: 1em 0;
}
.schedule-preview {
  margin-top: 0.8em;
  font-size: 120%;
}
</style>
