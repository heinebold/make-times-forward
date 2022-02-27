<template>
  <div />
</template>

<style scoped>
div {
  height: 128px;
  aspect-ratio: 1;
  background-size: contain;
  background-repeat: no-repeat;
  background-image: url("@/assets/logo/light/time-management-128.png");
  background-image: image-set(
    url("@/assets/logo/light/time-management-64.png") 0.5x,
    url("@/assets/logo/light/time-management-128.png") 1x,
    url("@/assets/logo/light/time-management-256.png") 2x,
    url("@/assets/logo/light/time-management-512.png") 4x
  );
}

@media (prefers-color-scheme: dark) {
  div {
    background-image: url("@/assets/logo/dark/time-management-128.png");
    background-image: image-set(
      url("@/assets/logo/dark/time-management-64.png") 0.5x,
      url("@/assets/logo/dark/time-management-128.png") 1x,
      url("@/assets/logo/dark/time-management-256.png") 2x,
      url("@/assets/logo/dark/time-management-512.png") 4x
    );
  }
}
</style>
