<template>
  <div class="settings">
    <h2>{{ t("heading.settings") }}</h2>
    trololol... no settings
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();
</script>

<style scoped>
div.settings > section > section {
  padding: 1em 2em;
}
</style>
