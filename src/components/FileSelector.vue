<template>
  <button @click="$refs.fileInput.click">
    <slot>Import</slot
    ><input ref="fileInput" type="file" @change="fileInputChange" />
  </button>
</template>

<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits<{ (e: "import-file", p: File): void }>();
const fileInput = ref();

function fileInputChange(event: Event) {
  if (event.target instanceof HTMLInputElement) {
    const file = event.target.files?.[0];
    if (file) {
      emit("import-file", file);
    }
  }
  clearInput(fileInput.value);
}

function clearInput(inputElement: HTMLInputElement) {
  inputElement.value = "";
  inputElement.files = null;
}
</script>

<style>
button input[type="file"] {
  display: none;
}
</style>
