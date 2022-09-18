<template>
  <input ref="fileInput" type="file" @change="fileInputChange" />
  <confirmation-modal
    name="importDialog"
    v-model="showModal"
    :click-to-close="false"
    :esc-to-close="true"
    @confirm="confirmImport"
    @closed="closePreview"
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
</template>

<script setup lang="ts">
import { ref } from "vue";
import { $vfm as vueFinalModal } from "vue-final-modal";
import ConfirmationModal from "@/components/ConfirmationModal.vue";
import { parseSchedule, TimeSlot } from "@/model/TimeSlot";
import FullSchedulePanel from "@/components/FullSchedulePanel.vue";
import MainSquare from "@/components/MainSquare.vue";

const emit = defineEmits<{ (e: "import-file", p: TimeSlot[]): void }>();
const showModal = ref(false);
const fileInput = ref();

function fileInputChange(event: Event) {
  if (event.target instanceof HTMLInputElement) {
    const file = event.target.files?.[0];
    if (file) {
      loadFile(file);
    }
  }
}

function loadFile(file: File) {
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
  emit("import-file", params.data as TimeSlot[]);
}

function closePreview() {
  fileInput.value.value = "";
  fileInput.value.files = undefined;
}
</script>
<style scoped>
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
