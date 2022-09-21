<template>
  <main-square class="edit-section">
    <schedule-card class="item-panel">
      <edit-item v-model:model-value="currentItem" />
      <div class="actions-panel">
        <template v-if="selectedId">
          <button
            :disabled="currentItemIncomplete || !currentItemModified"
            @click="updateItem"
          >
            Update
          </button>
          <button @click="deleteItem">Delete #{{ currentIndex }}</button>
        </template>
        <button :disabled="currentItemIncomplete" @click="addItem">
          {{ currentItemModified ? "Add" : "Copy" }}
        </button>
      </div>
    </schedule-card>
    <schedule-card class="controls-panel">
      <h3>File Import/Export</h3>
      <div class="actions-panel">
        <file-selector @import-file="importFile" />
        <button @click="exportFile">Export</button>
      </div>
    </schedule-card>
    <schedule-card class="controls-panel">
      <h3>Schedule Date</h3>
      <div class="actions-panel">
        <input type="date" v-model="dateOverrideString" />
      </div>
      <div class="actions-panel">
        <button
          v-if="scheduleStart?.isSame(scheduleEnd, 'date')"
          @click="overrideAllDate"
          :disabled="noValidDateOverride"
        >
          Set Date
        </button>
        <template v-else>
          <button @click="overrideStartDate" :disabled="noValidDateOverride">
            Set Start
          </button>
          <button @click="overrideEndDate" :disabled="noValidDateOverride">
            Set End
          </button>
          <button @click="overrideAllDate" :disabled="noValidDateOverride">
            Override All
          </button>
        </template>
      </div>
    </schedule-card>
  </main-square>
  <main-square>
    <h2 v-text="scheduleHeading" />
    <full-schedule-panel
      numbered
      :items="schedule"
      v-model:selected="selectedId"
    />
  </main-square>
  <confirmation-modal
    name="importDialog"
    v-model="showModal"
    :click-to-close="false"
    :esc-to-close="true"
    @confirm="confirmImport"
  >
    <template v-slot="{ params }">
      <main-square class="preview-area">
        <h2>Import JSON File</h2>
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
import { parseSchedule, stringifySchedule } from "@/model/Schedule";
import type { Schedule } from "@/model/Schedule";
import dayjs from "dayjs";

const scheduleStore = useScheduleStore();
const schedule = computed(() => scheduleStore.schedule);
const selectedId = ref("");
const currentItem: Ref<TimeSlot | undefined> = ref(undefined);
const currentIndex = computed(() =>
  schedule.value.findIndex((t) => t.id === selectedId.value)
);
const currentItemIncomplete = computed(
  () =>
    !currentItem.value?.title ||
    (isNaN(currentItem.value?.start.minute()) &&
      isNaN(currentItem.value?.end.minute()))
);
const currentItemModified = computed(() => {
  const currentSelected = schedule.value[currentIndex.value];
  return !(
    currentItem.value?.title === currentSelected?.title &&
    currentItem.value?.start.isSame(currentSelected?.start, "minute") &&
    currentItem.value?.end.isSame(currentSelected?.end, "minute")
  );
});
const dateOverride = ref(dayjs());
const dateOverrideString = computed({
  get: () => dateOverride.value.format("YYYY-MM-DD"),
  set: (newValue: string) => {
    dateOverride.value = dayjs(`${newValue}T00:00:00Z`);
  },
});
const noValidDateOverride = computed(() => isNaN(dateOverride.value.day()));
const showModal = ref(false);

const scheduleStart = computed(() => schedule.value[0]?.start);
const scheduleEnd = computed(() => {
  if (!schedule.value?.length) {
    return undefined;
  }
  return schedule.value.reduce((acc: TimeSlot, current: TimeSlot) =>
    current.end.isAfter(acc.end, "date") ? current : acc
  ).end;
});

const scheduleHeading = computed(() => {
  if (schedule.value.length < 1) {
    return "Schedule";
  }
  const start = scheduleStart.value?.format("YYYY-MM-DD") ?? "";
  const end = scheduleEnd.value?.format("YYYY-MM-DD") ?? "";
  if (start === end) {
    return start;
  }
  return `${start} - ${end}`;
});

watch(currentIndex, updateSelection);

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
  updateSelection(selectedIndex);
}

function updateSelection(index: number) {
  if (index >= 0) {
    currentItem.value = schedule.value[index];
    selectedId.value = currentItem.value?.id ?? "";
  } else {
    if (currentItem.value) {
      currentItem.value = { ...currentItem.value, id: "" };
    }
    if (selectedId.value.length) {
      selectedId.value = "";
    }
  }
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

function confirmImport(params?: { data?: Schedule }) {
  currentItem.value = undefined;
  updateSelection(-1);
  scheduleStore.replaceSchedule(params?.data ?? []);
}

function exportFile() {
  const data = new Blob([stringifySchedule(schedule.value, 2)], {
    type: "text/json",
  });
  saveAs(data, "schedule.json");
}

function overrideStartDate() {
  if (noValidDateOverride.value || !scheduleStart.value) {
    return;
  }
  const diff = dateOverride.value
    .startOf("day")
    .diff(scheduleStart.value.startOf("day"), "days");
  schedule.value.forEach((timeSlot) => {
    timeSlot.start = timeSlot.start.add(diff, "days");
    timeSlot.end = timeSlot.end.add(diff, "days");
  });
  scheduleStore.replaceSchedule(schedule.value);
}
function overrideEndDate() {
  if (noValidDateOverride.value || !scheduleEnd.value) {
    return;
  }
  const diff = dateOverride.value
    .startOf("day")
    .diff(scheduleEnd.value.startOf("day"), "days");
  schedule.value.forEach((timeSlot) => {
    timeSlot.start = timeSlot.start.add(diff, "days");
    timeSlot.end = timeSlot.end.add(diff, "days");
  });
  scheduleStore.replaceSchedule(schedule.value);
}
function overrideAllDate() {
  if (noValidDateOverride.value) {
    return;
  }
  schedule.value.forEach((timeSlot) => {
    timeSlot.start = timeSlot.start
      .set("year", dateOverride.value.year())
      .set("month", dateOverride.value.month())
      .set("date", dateOverride.value.date());
    timeSlot.end = timeSlot.end
      .set("year", dateOverride.value.year())
      .set("month", dateOverride.value.month())
      .set("date", dateOverride.value.date());
  });
  scheduleStore.replaceSchedule(schedule.value);
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
  margin: 0.5em 0;
}
.controls-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  justify-content: center;
}

.actions-panel button,
.actions-panel input {
  font-size: 67%;
  padding: 0.334em 0.667em;
  white-space: nowrap;
  min-width: 5em;
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
  padding: 0 0 1em;
}
.preview-area > h2,
.preview-area > p {
  width: 100%;
  text-align: left;
}
.preview-area > h2 {
  margin: 0;
}
.schedule-preview {
  margin-top: 0.8em;
  font-size: 120%;
}
</style>
