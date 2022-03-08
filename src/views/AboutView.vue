<template>
  <div class="about">
    <h2>About</h2>
    <section>
      <h3>Attribution</h3>
      <p>
        <a href="https://www.flaticon.com/free-icons/productivity"
          >Productivity icons created by monkik - Flaticon</a
        >
      </p>
      <p>
        This app uses vue 3, vuex 4, vue-router 4, and dayjs, which all are
        under MIT license.
      </p>
    </section>
    <section>
      <h3>Disclaimer</h3>
      <p>
        This is a private page, I do not earn any money with it and only intend
        to use it myself. The only reason you find it in the internet is because
        I want to access it with my phone.
      </p>
      <p>
        If you came here by yourself and do not have this link personally from
        me (the guy in the domain name), but you still have complaints about
        this page, the recommended solution is clicking your browser's back
        button.
      </p>
    </section>
  </div>
</template>

<style scoped>
.about {
  padding: 1em;
  max-height: calc(100vh - var(--header-height));
}
.about section {
  margin: 1em;
}
</style>
