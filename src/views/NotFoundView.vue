<template>
  <div class="e404">
    <h2>Nope, that's not a thing here</h2>
    <section>
      <h3>
        Sorry, but we have no clue about this "<em>{{
          decodeURI($route.path).substring(1)
        }}</em
        >" thingy.
      </h3>
      Why don't you use one of the links in the navigation bar? They lead you to
      places that actually exist!
    </section>
  </div>
</template>

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
