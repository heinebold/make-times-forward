<template>
  <div class="e404">
    <h2>{{ t("error.404.heading") }}</h2>
    <section>
      <i18n-t tag="h3" keypath="error.404.subheading">
        <em>{{ decodeURI($route.path).substring(1) }}</em>
      </i18n-t>
      {{ t("error.404.message") }}
    </section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
const { t } = useI18n();
</script>

<style scoped>
.e404 {
  padding: 1em;
  max-height: calc(100vh - var(--header-height));
}
.e404 section {
  margin: 1em;
}
.e404 h3 {
  margin-bottom: 0.7em;
}
</style>
