<template>
  <input type="file" @change="fileInputChange" />
</template>

<script setup lang="ts">
const emit = defineEmits<{ (e: "select-files", f: FileList): void }>();

function fileInputChange(event: Event) {
  if (event.target instanceof HTMLInputElement && event.target.files != null) {
    emit("select-files", event.target.files);
  }
}
</script>
<style scoped></style>
