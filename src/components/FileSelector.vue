<template>
  <input type="file" @change="fileInputChange" />
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: "select-files", f: FileList): void;
  (e: "test"): void;
}>();

function fileInputChange(event: InputEvent & { target: HTMLInputElement }) {
  if (event.target.files != null) {
    emit("select-files", event.target.files);
  }
}
</script>
<style scoped></style>
