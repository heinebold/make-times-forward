<template>
  <main-square class="edit-section">
    <schedule-card class="selected-item">
      <edit-item v-model:model-value="currentItem" />
    </schedule-card>

    <div>
      <template v-if="selectedId">
        <button :disabled="!currentItem?.title" @click="updateItem">
          Update
        </button>
        <button @click="deleteItem">Delete #{{ currentIndex }}</button>
      </template>
    </div>
  </main-square>

  <full-schedule-panel
    numbered
    :items="schedule"
    v-model:selected="selectedId"
  />
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

const scheduleStore = useScheduleStore();
const schedule = computed(() => scheduleStore.schedule);
const selectedId = ref("");
const currentItem: Ref<TimeSlot | undefined> = ref(undefined);
const currentIndex = computed(() =>
  schedule.value.findIndex((t) => t.id === selectedId.value)
);

watch(selectedId, (newSelectedId: string) => {
  if (newSelectedId.length) {
    currentItem.value = schedule.value.find((t) => t.id === newSelectedId);
  } else if (currentItem.value) {
    currentItem.value = { ...currentItem.value, id: "" };
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
</style>
