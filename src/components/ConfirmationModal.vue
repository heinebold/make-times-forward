<template>
  <vue-final-modal
    :focus-trap="true"
    v-slot="{ params, close }"
    classes="modal-container"
    content-class="modal-content"
    @before-open="confirmed = false"
    @before-close="
      confirmed ? emit('confirm', $event.ref.params.value) : emit('cancel')
    "
  >
    <div class="modal__content"><slot :params="params" /></div>
    <div class="modal__action">
      <button @click="close"><slot name="cancel">Cancel</slot></button>
      <button
        v-if="params.canConfirm ?? true"
        @click="(confirmed = true) && close()"
      >
        <slot name="confirm">Confirm</slot>
      </button>
    </div>
  </vue-final-modal>
</template>

<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits<{
  (e: "cancel"): void;
  (e: "confirm", p: object): void;
}>();
const confirmed = ref(false);
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
