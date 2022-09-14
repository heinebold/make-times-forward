<template>
  <div class="schedule-item" :title="modelValue?.id">
    <label>Title <input v-model="title" type="text" /></label>
    <label>Start <input v-model="start" type="datetime-local" /></label>
    <label>End <input v-model="end" type="datetime-local" /></label>
  </div>
</template>

<script setup lang="ts">
import type { TimeSlot } from "@/model/TimeSlot";
import { computed } from "vue";
import type { Ref } from "vue";
import dayjs from "dayjs";

const props = defineProps<{ modelValue?: TimeSlot }>();
const emit = defineEmits<{ (e: "update:modelValue", p: TimeSlot): void }>();

const title: Ref<string | undefined> = computed({
  get: () => props.modelValue?.title,
  set: (title) => emitUpdate({ title }),
});
const start: Ref<string | undefined> = computed({
  get: () => props.modelValue?.start.format("YYYY-MM-DDTHH:mm"),
  set: (start) => emitUpdate({ start }),
});
const end: Ref<string | undefined> = computed({
  get: () => props.modelValue?.end.format("YYYY-MM-DDTHH:mm"),
  set: (end) => emitUpdate({ end }),
});

function emitUpdate(update: { title?: string; start?: string; end?: string }) {
  emit("update:modelValue", {
    title: update.title ?? title.value ?? "",
    start: dayjs(update.start ?? start.value),
    end: dayjs(update.end ?? end.value ?? update.start ?? start.value),
    id: props.modelValue?.id ?? "",
  });
}
</script>

<style scoped>
label {
  display: flex;
  justify-content: space-between;
  font-size: var(--edit-font-size);
}
label input {
  width: 14em;
  max-width: 14em;
  font-size: var(--edit-font-size);
}
</style>
