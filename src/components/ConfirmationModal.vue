<template>
  <VueFinalModal
    v-model="visible"
    class="modal-container"
    content-class="modal-content"
    :click-to-close="clickToClose"
    :esc-to-close="escToClose"
    @opened="confirmButton?.focus()"
    @before-close="beforeClose"
  >
    <div class="modal__content"><slot /></div>
    <div class="modal__action">
      <button @click="visible = false">
        <slot name="cancel">Cancel</slot>
      </button>
      <button v-if="canConfirm" ref="confirmButton" @click="confirm">
        <slot name="confirm">Confirm</slot>
      </button>
    </div>
  </VueFinalModal>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { VueFinalModal } from "vue-final-modal";

const props = defineProps<{
  modelValue: boolean;
  clickToClose?: boolean;
  escToClose?: boolean;
  canConfirm?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "cancel"): void;
  (e: "confirm"): void;
}>();

const confirmed = ref(false);
const confirmButton = ref<HTMLButtonElement>();

const visible = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit("update:modelValue", value),
});

function beforeClose() {
  if (confirmed.value) {
    emit("confirm");
  } else {
    emit("cancel");
  }
  confirmed.value = false;
}

function confirm() {
  confirmed.value = true;
  visible.value = false;
}
</script>

<style scoped>
:deep(.modal-container) {
  display: flex;
  justify-content: center;
  align-items: center;
}
:deep(.modal-content) {
  position: relative;
  display: flex;
  flex-direction: column;
  max-height: 90%;
  margin: 0 1rem;
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 0.25rem;
  background: var(--color-background);
}
.modal__content {
  flex-grow: 1;
  overflow-y: auto;
}
.modal__action {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  padding: 1rem 0 0;
  gap: 1em;
}
</style>
