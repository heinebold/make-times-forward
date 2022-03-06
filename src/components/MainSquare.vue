<template>
  <section class="main-square">
    <slot></slot>
  </section>
</template>

<style scoped>
.main-square {
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden auto;

  width: 44vmax;
  height: 44vmax;
  font-size: 2vmax;
}

@media (min-aspect-ratio: 2/1), (max-aspect-ratio: 1/2) {
  .main-square {
    width: 88vmin;
    height: 88vmin;
    font-size: 4vmin;
  }
}
</style>
